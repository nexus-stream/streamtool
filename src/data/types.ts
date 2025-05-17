import { RaceParticipantStatus } from "../therun/types";

export interface Participant {
  user: string;
  twitchUser: string;
  displayName: string;
  pronouns: string;
  avatar: string;
  status: RaceParticipantStatus;
}

interface RunningTimer {
  status: "running";
  startTime: number;
}

interface StoppedTimer {
  status: "stopped";
  currentTime: number;
}

export type TimerInfo = RunningTimer | StoppedTimer;

export interface RaceInfo {
  game: string;
  category: string;
  participants: Participant[];
  timerInfo: TimerInfo;
}

export interface RaceInfoOverrides {
  game?: string;
  category?: string;
  participantPatches: { [user: string]: Partial<Participant> };
  timerInfo?: TimerInfo;
}

export interface Stage {
  // guid for internal purposes - lets multiple stages for the same
  // run get added, which feels like it could be useful.
  id: string;

  // therun.gg race id. In real usage this will always be defined, but
  // it's useful to be able to set up fake races with dummy data during
  // development.
  raceId?: string;
  // Friendly name to make the stage listing readable.
  name: string;

  // Race information automatically pulled and updated from therun.gg
  raceInfo: RaceInfo;
  // Manual overrides of the automatically updated data
  raceInfoOverrides: RaceInfoOverrides;
}
