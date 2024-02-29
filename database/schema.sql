set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- drop schema INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
  "userId" serial PRIMARY KEY,
  "username" varchar,
  "hashedPassword" varchar,
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "public"."projects" (
  "projectId" serial PRIMARY KEY,
  "title" varchar,
  "ownerId" integer,
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "public"."boards" (
  "boardId" serial PRIMARY KEY,
  "projectId" integer,
  "title" varchar,
  "description" varchar,
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "public"."boardObjects" (
  "boardObjectId" serial PRIMARY KEY,
  "boardId" integer,
  "x" integer,
  "y" integer,
  "type" varchar,
  "title" varchar,
  "content" varchar,
  "createdAt" timestamp DEFAULT (now())
);

ALTER TABLE "public"."projects" ADD FOREIGN KEY ("ownerId") REFERENCES "public"."users" ("userId");

ALTER TABLE "public"."boards" ADD FOREIGN KEY ("projectId") REFERENCES "public"."projects" ("projectId");

-- ALTER TABLE "public"."boards" ADD FOREIGN KEY ("boardId") REFERENCES "public"."boardObjects" ("boardId");
