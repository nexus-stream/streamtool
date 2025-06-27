import { RaceStatus } from "../../races/types";
import { DisplayParticipant } from "../participant/types";

// This is the type that we expose to streamtool frames, as well as to
// Advanced Scene Switcher. If you want to include extra data from therun,
// add a field here, and then add a builder to displayRaceFields.ts.
//
// Because we use `undefined` to mean there is no available override for
// any of these fields, we should avoid undefined fields in this object.
// Use `null` instead.
export interface DisplayRace {
  raceId: string;
  game: string;
  category: string;
  participants: DisplayParticipant[];
  status: RaceStatus;
  commentators: Commentator[];
  startTime: string | null;
  endTime: string | null;
}

export interface Commentator {
  user: string;
  pronouns?: string;
  avatar?: string;
}
