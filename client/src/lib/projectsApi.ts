export type CreateProject = {
  title: string;
  ownerId: number;
};

// export const tokenKey = 'react-context-jwt';

export type Project = {
  projectId: number;
} & CreateProject;

export async function getProject(projectId: number): Promise<Project> {
  console.log('token', sessionStorage.getItem('token'));
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/projects/project/' + projectId, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function getProjects(): Promise<Project[]> {
  console.log('token', sessionStorage.getItem('token'));
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/projects/', req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

// create a project

export async function createProject({
  title,
  ownerId,
}: CreateProject): Promise<Project> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log('req', req);
  const res = await fetch('/api/create-project/' + ownerId + '/' + title, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return json;
}

export async function createBoard({ projectId, title, body }) {
  console.log('projectId', projectId)
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      title,
      body,
    }),
  };
  console.log('req', req);
  const res = await fetch('/api/create-board/' + projectId, req)
  console.log('res', res)
  const json = await res.json();

  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}
