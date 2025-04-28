import { FrameProps } from "../frameProps";

export function NameFrame({ stage, runnerIndex }: FrameProps) {
  if (!runnerIndex) {
    return null;
  }

  return <p>{stage.runners[runnerIndex].name}</p>;
}
