import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { ParticipantStream } from "../components/ParticipantStream";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
});

export const participantStreamFrame = buildFrameComponent(
  {
    displayName: "Participant Stream",
    width: 1920,
    height: 1080,
  },
  Params,
  ({ race, participantPosition }) => {
    const participant = race.participants[participantPosition - 1];

    if (!participant) {
      return null;
    }

    return <ParticipantStream participant={participant} />;
  }
);
