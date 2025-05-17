import { RaceParticipantStatus, RaceStatus } from "../races/types";

export interface DisplayParticipant {
  user: string;
  twitchUser: string;
  displayName: string;
  pronouns?: string;
  avatar?: string;
  status: RaceParticipantStatus;
}

export interface DisplayRace {
  game: string;
  category: string;
  participants: DisplayParticipant[];
  status: RaceStatus;
  startTime: string | null;
  endTime: string | null;
}

export interface RaceOverrides {
  game?: string;
  category?: string;
  participantOverrides: { [user: string]: Partial<DisplayParticipant> };
}

export interface Stage {
  // guid for internal purposes - lets multiple stages for the same
  // run get added, which feels like it could be useful.
  id: string;

  // therun.gg race id
  raceId: string;

  // Friendly name to make the stage listing readable.
  name: string;

  // Manual overrides of the automatically updated data.
  overrides: RaceOverrides;
}

export interface StageWithPopulatedRace extends Stage {
  race: DisplayRace;
}
