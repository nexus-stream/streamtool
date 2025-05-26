import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";

const Params = z.object({
  enumType: z.enum(["first", "second", "third"]).default("first"),
});

export const debugFrame = buildFrameComponent(
  {
    displayName: "Debug View",
    width: 400,
    height: 400,
  },
  Params,
  ({ race, enumType }) => {
    return (
      <div>
        <p>{JSON.stringify(race)}</p>
        <p>{enumType}</p>
      </div>
    );
  }
);
