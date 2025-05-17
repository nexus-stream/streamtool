import { Race } from "./types";

export async function getRace(raceId: string): Promise<Race> {
  const endpoint = buildRaceEndpoint(raceId);
  return (await fetch(endpoint)).json();
}

function buildRaceEndpoint(raceId: string): string {
  return `https://races.therun.gg/${raceId}`;
}
