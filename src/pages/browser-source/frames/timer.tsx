import { buildFrameComponent } from "../frame";

export const timerFrame = buildFrameComponent(
  {
    displayName: "Race Timer",
    width: 200,
    height: 100,
  },
  ({ race }) => {
    return <p>{JSON.stringify(race.startTime)}</p>;
  }
);
