import { FrameProps } from "../frameProps";

export function TimerFrame({ stage }: FrameProps) {
  return <p>{JSON.stringify(stage.timerInfo)}</p>;
}
