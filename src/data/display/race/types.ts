import { RaceParticipantStatus } from "../../races/types";

// Because we use `undefined` to mean there is no available override for
// any of these fields, we should avoid undefined fields in this object.
// Use `null` instead.
export interface DisplayParticipant {
  user: string;
  twitchUser: string;
  displayName: string;
  pronouns: string | null;
  avatar: string | null;
  status: RaceParticipantStatus;
  startTime: number | null;
  finalTime: number | null;
  pb: string | null;
  score: number | null;
}
