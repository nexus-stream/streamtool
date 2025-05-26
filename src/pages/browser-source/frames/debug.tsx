import { buildFrameComponent } from "../frame";

export const debugFrame = buildFrameComponent(
  {
    displayName: "Debug View",
    width: 400,
    height: 400,
  },
  ({ race }) => {
    return <p>{JSON.stringify(race)}</p>;
  }
);
