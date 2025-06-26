import { RaceParticipant, Race } from "../../../../data/races/types";

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
