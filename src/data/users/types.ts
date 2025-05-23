// This type doesn't appear to exist on therun's end, so recreated here
// based on the schema of the json I get from their users endpoint.

export interface User {
  bio: string;
  user: string;
  picture: string;
  login: string;
  pronouns: string;
  searchName: string;
}
