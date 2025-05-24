import { buildFrameComponent } from "../frame";

export const timerFrame = buildFrameComponent("Race Timer", ({ race }) => {
  return <p>{JSON.stringify(race.startTime)}</p>;
});
