import {
  RaceParticipantStatus,
  RaceStatus,
  Race,
  RaceParticipantWithLiveData,
} from "../races/types";
import { User } from "../users/types";

export interface DisplayRace {
  game: string;
  category: string;
  participants: DisplayParticipant[];
  status: RaceStatus;
  startTime: string | null;
  endTime: string | null;
}

export interface DisplayParticipant {
  user: string;
  twitchUser: string;
  displayName: string;
  pronouns: string | null;
  avatar: string | null;
  status: RaceParticipantStatus;
}

export type RaceDisplayFieldGetter<TValue> = (
  race: Race,
  userEntities: Record<string, User>
) => TValue;

export type ParticipantDisplayFieldGetter<TValue> = (
  participant: RaceParticipantWithLiveData,
  profile: Partial<User>
) => TValue;
