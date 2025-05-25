import { User } from "./types";

export async function getUser(user: string): Promise<User> {
  const endpoint = buildUserEndpoint(user);
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}

function buildUserEndpoint(user: string): string {
  return `${import.meta.env.VITE_THERUN_API_ENDPOINT}/users/${user}/global`;
}
