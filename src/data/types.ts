export interface Runner {
  name: string;
  pronouns: string;
  avatar: string;
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

export interface Stage {
  id: string;
  name: string;
  title: string;
  runners: Runner[];
  timerInfo: TimerInfo;

  // When defined, lock manual editing and automatically keep the above
  // values updated from the docked page.
  theRunGGId?: string;
}
