import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { ParticipantNameplate } from "../components/ParticipantNameplate";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
});

export const participantNameplateFrame = buildFrameComponent(
  {
    displayName: "Participant Nameplate",
    width: 320,
    height: 100,
  },
  Params,
  ({ race, participantPosition }) => {
    const participant = race.participants[participantPosition - 1];

    if (!participant) {
      return null;
    }

    return <ParticipantNameplate race={race} participant={participant} />;
  }
);
