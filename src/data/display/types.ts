import {
  RaceParticipantStatus,
  RaceStatus,
  Race,
  RaceParticipantWithLiveData,
} from "../races/types";
import { User } from "../users/types";

// Because we use `undefined` to mean there is no available override for
// any of these fields, we should avoid undefined fields in this object.
// Use `null` instead.
export interface DisplayRace {
  raceId: string;
  game: string;
  category: string;
  participants: DisplayParticipant[];
  status: RaceStatus;
  startTime: string | null;
  endTime: string | null;
}

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
}

export type RaceDisplayFieldGetter<TValue> = (
  race: Race,
  userEntities: Record<string, User>
) => TValue;

export type ParticipantDisplayFieldGetter<TValue> = (
  participant: RaceParticipantWithLiveData,
  profile: Partial<User>
) => TValue;
