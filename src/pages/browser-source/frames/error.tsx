import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";

const Params = z.object({
  message: z.string(),
});

export const errorFrame = buildFrameComponent(
  {
    displayName: "Error Fallback",
    width: 320,
    height: 240,
  },
  Params,
  ({ message }) => {
    return <p>{message}</p>;
  }
);
