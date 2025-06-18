import { DisplayRace, DisplayParticipant } from "../display/types";

interface BaseStage {
  // guid for internal purposes - lets multiple stages for the same
  // run get added, which feels like it could be useful.
  id: string;

  // Friendly name to make the stage listing readable.
  name: string;

  streamTitle?: string;
  streamGameId?: string;

  stageEnterWebsocketEvent?: string;
}

export interface RaceStage extends BaseStage {
  kind: "race";

  // therun.gg race id
  raceId: string;

  // Manual overrides of the automatically updated data.
  raceOverrides: Partial<DisplayRace>;
  participantOverrides: { [user: string]: Partial<DisplayParticipant> };
  participantOrder?: string[];
}

export interface VodStage extends BaseStage {
  kind: "vod";

  vodId: string;
}

export type Stage = RaceStage | VodStage;
