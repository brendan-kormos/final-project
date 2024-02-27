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



export async function getBoardObjects(boardId:number): Promise<Project[]> {
  console.log('token', sessionStorage.getItem('token'));
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/board/'+boardId, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}


export async function createGenericBoardObject(boardId: number): Promise<Project[]> {
  console.log('token', sessionStorage.getItem('token'));
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/board/generic/' + boardId, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}
