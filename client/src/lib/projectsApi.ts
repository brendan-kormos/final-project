export type CreateProject = {
  title: string;
  ownerId: number;
};

// export const tokenKey = 'react-context-jwt';

export type Board = {
  boardId: number;
  title: string;
  description: string;
  projectId: number;
};
export type Project = {
  projectId: number;
} & CreateProject;

export async function getProject(
  projectId: number
): Promise<{ projects: Project[]; boards: Board[] }> {
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

export async function getProjects(): Promise<{
  projects: Project[];
  boards: Board[];
}> {
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
  const res = await fetch('/api/project/' + ownerId + '/' + title, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return json;
}

// edit a project
export async function editProject(
  projectId: number,
  title: string
): Promise<{ projects: Project[]; boards: Board[] }> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/project/' + projectId + '/' + title, req);
  console.log('edit res', res);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function createBoard({ projectId, title, body }) {
  console.log('projectId', projectId);
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
  const res = await fetch('/api/board/' + projectId, req);
  const json = await res.json();

  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function deleteProject(projectId) {
  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };

  const res = await fetch('/api/project/' + projectId, req);
  const json = await res.json();
  // console.log('json', json);
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function deleteBoard(boardId) {
  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };

  const res = await fetch('/api/board/' + boardId, req);
  const json = await res.json();
  // console.log('json', json);
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function editBoard(boardId: number, title: string, body: string) {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      body,
    }),
  };
  const res = await fetch('/api/board/' + boardId + '/' + title, req);
  console.log('edit res', res);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}
