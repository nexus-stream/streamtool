import { User } from "./types";

export async function getUser(user: string): Promise<User> {
  const endpoint = buildUserEndpoint(user);
  return (await fetch(endpoint)).json();
}

function buildUserEndpoint(user: string): string {
  return `https://therun.gg/api/users/${user}/global`;
}
