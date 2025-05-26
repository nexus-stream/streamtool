import { DisplayRace, DisplayParticipant } from "../display/types";

export interface Stage {
  // guid for internal purposes - lets multiple stages for the same
  // run get added, which feels like it could be useful.
  id: string;

  // therun.gg race id
  raceId: string;

  // Friendly name to make the stage listing readable.
  name: string;

  // Manual overrides of the automatically updated data.
  raceOverrides: Partial<DisplayRace>;
  participantOverrides: { [user: string]: Partial<DisplayParticipant> };
}

export interface StageWithPopulatedRace extends Stage {
  race: DisplayRace;
}
