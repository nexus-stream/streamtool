import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";

const Params = z.object({
  message: z.string(),
});

export const errorFrame = buildFrameComponent(
  "Error Fallback",
  Params,
  ({ message }) => {
    return <p>{message}</p>;
  }
);
