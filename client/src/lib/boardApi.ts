import {BoardObjectData} from "./canvas"

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

export async function requestCreateButton(
  boardId: number,
  data:BoardObjectData
): Promise<BoardObjectData[]> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(data)
  };
  const res = await fetch('/api/board/create/' + boardId, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}

export async function requestEditObject(
  data: BoardObjectData
): Promise<BoardObjectData[]> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`/api/board/edit`, req);
  const json = await res.json();
  if (!res.ok) throw new Error(`fetch Error ${res.status}. ${json.error}`);
  return json;
}
