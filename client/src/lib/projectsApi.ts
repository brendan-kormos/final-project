export type CreateProject = {
  title: string;
  ownerId: number;
};

export const tokenKey = 'react-context-jwt';

export type Project = {};
// create a project

export async function createProject({
  title,
  ownerId,
}: CreateProject): Promise<Project> {
  console.log('sessoinStorage', sessionStorage)
  console.log('token', sessionStorage.getItem('token'));
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log('req', req)
  const res = await fetch(
    '/api/create-project/' + ownerId + '/' + title,
    req
  );
  const json = await res.json()
  console.log(res)
  console.log('resjson', json)
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return json
}
