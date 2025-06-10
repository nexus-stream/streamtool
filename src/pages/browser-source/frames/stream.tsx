import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { ParticipantStream } from "../components/ParticipantStream";
import { useHoldValue } from "../../../components/useHoldValue";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import classNames from "classnames";

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

    const [twitchUser, isTransition] = useHoldValue(
      participant?.twitchUser,
      `${race.raceId}:${participant.user}`
    );

    if (!participant) {
      return null;
    }

    return (
      <div
        className={classNames({ fading: isTransition })}
        css={containerStyle}
      >
        <ParticipantStream twitchUser={twitchUser} />
      </div>
    );
  }
);

const containerStyle = css`
  ${STYLES.fullSize};
  transition: opacity 400ms ease-in-out;
  transition-delay: 100ms;
  opacity: 1;

  &.fading {
    transition-delay: unset;
    opacity: 0;
  }
`;
