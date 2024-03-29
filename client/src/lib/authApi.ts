export type User = {
  userId: number;
  username: string;
};
export type Auth = {
  user: User;
  token: string;
};

/**
 * Signs in a user.
 */
export async function signIn(
  username: string,
  password: string
): Promise<Auth> {
  return await signUpOrIn('sign-in', username, password);
}

/**
 * Signs up a user.
 */
export async function signUp(
  username: string,
  password: string
): Promise<User> {
  return await signUpOrIn('sign-up', username, password);
}

/**
 * Signs up or signs in depending on the action.
 */
async function signUpOrIn(
  action: 'sign-up',
  username: string,
  password: string
): Promise<User>;
async function signUpOrIn(
  action: 'sign-in',
  username: string,
  password: string
): Promise<Auth>;
async function signUpOrIn(
  action: 'sign-up' | 'sign-in',
  username: string,
  password: string
): Promise<User | Auth> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  };
  const res = await fetch(`/api/auth/${action}`, req);
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return json
}
