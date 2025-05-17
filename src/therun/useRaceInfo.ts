/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { RaceInfo } from "../data/types";

// Returns the current state of the given race id, based on information
// received from therun's websocket api.
export function useRaceInfo(_raceId: string): RaceInfo | undefined {
  const [raceInfo, _setRaceInfo] = useState<RaceInfo | undefined>();

  // Make a websocket connection, call setRaceInfo on change.

  return raceInfo;
}

function buildWebsocketEndpoint(raceId: string): string {
  return `wss://ws.therun.gg?race=${raceId}`;
}
