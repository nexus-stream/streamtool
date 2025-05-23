import { Race } from "./types";

export async function getRace(raceId: string): Promise<Race> {
  const endpoint = buildRaceEndpoint(raceId);
  const response = await fetch(endpoint);
  const json = await response.json();
  return json.result;
}

function buildRaceEndpoint(raceId: string): string {
  // return `https://races.therun.gg/${raceId}`;
  return `https://therun.kyle.soy/races/${raceId}`;
}
