import { RaceParticipant, Race } from "../../../../../data/races/types";

// These types are inferred from looking at the data we get from therun's websocket.
// Would be a good idea in the future to version and share these types with therun's
// code in a more robust way.

export interface ParticipantUpdate {
  type: "participantUpdate";
  data: RaceParticipant;
}

export interface RaceUpdate {
  type: "raceUpdate";
  data: Race;
}

export interface RaceMessage {
  type: "message";
  data: unknown;
}

export type LiveUpdateMessage = ParticipantUpdate | RaceUpdate | RaceMessage;
