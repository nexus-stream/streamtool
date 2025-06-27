import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { TwitchEmbed } from "../components/TwitchEmbed";
import {
  transitionHoldStyle,
  useTransitionHoldValue,
} from "../../../util/useTransitionHoldValue";
import { css } from "@emotion/react";
import { STYLES } from "../../../style/styles";
import classNames from "classnames";
import { useParticipantAtPosition } from "../hooks/useParticipantAtPosition";
import { useSelector } from "react-redux";
import { selectCurrentStageId } from "../../../data/stages/selectors";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  positionType: z.enum(["manual", "results"]).default("manual"),
});

export const participantStreamFrame = buildFrameComponent(
  {
    displayName: "Participant Stream",
    width: 1920,
    height: 1080,
    defaultName: ({ participantPosition }) =>
      `Participant ${participantPosition} Stream`,
  },
  Params,
  ({ participantPosition, positionType }) => {
    const stageId = useSelector(selectCurrentStageId);
    const participant = useParticipantAtPosition(
      positionType,
      participantPosition
    );

    const [twitchUser, isTransition] = useTransitionHoldValue(
      participant?.twitchUser,
      `${stageId}:${participant?.user}`
    );

    if (!participant) {
      return null;
    }

    return (
      <div
        className={classNames({ fading: isTransition })}
        css={containerStyle}
      >
        <TwitchEmbed twitchUser={twitchUser} />
      </div>
    );
  }
);

const containerStyle = css`
  ${STYLES.fullSize};
  ${transitionHoldStyle};
  opacity: 1;

  &.fading {
    transition-delay: unset;
    opacity: 0;
  }
`;
