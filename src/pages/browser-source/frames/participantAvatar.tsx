import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { FrameAvatar } from "../components/FrameAvatar";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
});

export const participantAvatarFrame = buildFrameComponent(
  {
    displayName: "Participant Avatar",
    width: 240,
    height: 240,
    defaultName: ({ participantPosition }) =>
      `Participant ${participantPosition} Avatar`,
  },
  Params,
  ({ race, participantPosition }) => {
    const participant = race.participants[participantPosition - 1];

    if (!participant?.avatar) {
      return null;
    }

    return (
      <FrameAvatar
        src={participant?.avatar ?? undefined}
        transitionHoldKey={`${race.raceId}:${participant.user}`}
      />
    );
  }
);
