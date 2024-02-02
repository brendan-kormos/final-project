/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import argon2 from 'argon2';
import pg, { Client } from 'pg';
import jwt from 'jsonwebtoken';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
  authMiddleware,
} from './lib/index.js';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

type Project = {
  projectId: number;
  title: string;
  ownerId: number;
};

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

// app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
// app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }

    const sqlCheck = `
      select "username"
      from "users"
      where "username" = $1
    `;

    const checkParams = [username];
    const checkResult = await db.query(sqlCheck, checkParams);
    const [exists] = checkResult.rows;
    if (exists) {
      throw new ClientError(400, 'username already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning *
    `;

    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
    const params = [username];

    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

//get project

app.get(
  '/api/projects/project/:projectId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { projectId } = req.params;

      if (!projectId || isNaN(projectId) || !Number(projectId)) {
        throw new ClientError(401, 'invalid projectId');
      }

      if (!req.user) {
        throw new ClientError(401, 'not logged in');
      }
      const sql = `
      select "title", "ownerId"
      from "projects"
      where "projectId" = $1
    `;
      const result = await db.query<Project>(sql, [projectId]);
      const val = result.rows[0];
      console.log('val', val);
      res.status(201).json(val);
    } catch (err) {
      next(err);
    }
  }
);

// get all projects

app.get('/api/projects', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }
    const projectsSql = `
      select "projectId", "title", "ownerId"
      from "projects"
      where "ownerId" = $1
    `;
    const projectsResult = await db.query<Project>(projectsSql, [
      req.user.userId,
    ]);
    const projects = projectsResult.rows;

    // const boardsSql = `
    //   select "projectId", "title", "ownerId"
    //   from "projects"
    //   where "ownerId" = $1
    // `;
    const boardsSql = `
  SELECT
    boards."boardId" AS board_id,
    boards."title" AS board_title,
    projects."projectId" AS project_id,
    projects."title" AS project_title
  FROM
    "public"."boards" AS boards
  JOIN
    "public"."projects" AS projects ON boards."projectId" = projects."projectId"
  WHERE
    projects."ownerId" = $1;
`;
    const boardsResult = await db.query(boardsSql, [req.user.userId]);
    const boards = boardsResult.rows;

    // const returnObj = { projects };
    console.log(boards);
    res.status(201).json(projects);
  } catch (err) {
    next(err);
  }
});

// create project
app.post(
  '/api/create-project/:ownerId/:title',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { ownerId, title } = req.params;

      if (!ownerId) {
        throw new ClientError(400, 'no ownerId was provided');
      }
      if (!title) {
        throw new ClientError(400, 'no title was provided');
      }

      if (!req.user) {
        throw new ClientError(401, 'not logged in');
      }
      const sql = `
      insert into "projects" ("ownerId", "title")
      values ($1, $2)
      returning "projectId", "ownerId", "title"
    `;
      const result = await db.query<Project>(sql, [req.user?.userId, title]);
      const val = result.rows[0];

      res.status(201).json(val);
    } catch (err) {
      next(err);
    }
  }
);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
