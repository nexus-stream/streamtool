import { User } from "./types";

export async function getUser(user: string): Promise<User> {
  const endpoint = buildUserEndpoint(user);
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}

function buildUserEndpoint(user: string): string {
  return `https://therun.gg/api/users/${user}/global`;
  // return `https://therun.kyle.soy/api/users/${user}/global`;
}
