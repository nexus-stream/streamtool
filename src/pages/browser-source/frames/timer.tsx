import { Frame, FrameProps } from "../frame";

function TimerFrame({ race }: FrameProps) {
  return <p>{JSON.stringify(race.startTime)}</p>;
}

export const timerFrame: Frame = {
  fc: TimerFrame,
  frameId: "timer",
  displayName: "Race Timer",
};
