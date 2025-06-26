import { z } from "zod/v4";
import { useSelector } from "react-redux";
import { useParticipantAtPosition } from "../hooks/useParticipantAtPosition";
import { FrameAvatar } from "../components/FrameAvatar";
import { buildFrameComponent } from "../frame";
import { selectCurrentStageId } from "../../../data/stages/selectors";

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
  ({ participantPosition, positionType }) => {
    const stageId = useSelector(selectCurrentStageId);
    const participant = useParticipantAtPosition(
      positionType,
      participantPosition
    );

    if (!participant?.avatar) {
      return null;
    }

    return (
      <FrameAvatar
        src={participant?.avatar ?? undefined}
        transitionHoldKey={`${stageId}:${participant.user}`}
      />
    );
  }
);
