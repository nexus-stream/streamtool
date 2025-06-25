import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { FrameAvatar } from "../components/FrameAvatar";
import { getParticipantFromPosition } from "../components/getParticipantFromPosition";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  positionType: z.enum(["manual", "results"]).default("manual"),
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
  ({ race, participantPosition, positionType }) => {
    const participant = getParticipantFromPosition(
      race.participants,
      positionType,
      participantPosition
    );

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
