import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";

const Params = z.object({
  participantIndex: z.coerce.number().default(0),
});

export const nameFrame = buildFrameComponent(
  {
    displayName: "Participant Name",
    width: 320,
    height: 100,
  },
  Params,
  ({ race, participantIndex }) => {
    return <p>{race.participants[participantIndex].displayName}</p>;
  }
);
