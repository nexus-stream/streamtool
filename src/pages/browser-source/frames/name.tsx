import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";

const Params = z.object({
  participantIndex: z.coerce.number(),
});

export const nameFrame = buildFrameComponent(
  "Participant Name",
  Params,
  ({ race, participantIndex }) => {
    return <p>{race.participants[participantIndex].displayName}</p>;
  }
);
