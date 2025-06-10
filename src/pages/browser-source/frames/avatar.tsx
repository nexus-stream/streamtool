import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { Avatar } from "../../../components/Avatar";
import { useHoldValue } from "../../../components/useHoldValue";
import { css } from "@emotion/react";
import classNames from "classnames";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
});

export const avatarFrame = buildFrameComponent(
  {
    displayName: "Avatar",
    width: 240,
    height: 240,
  },
  Params,
  ({ race, participantPosition }) => {
    const participant = race.participants[participantPosition - 1];
    const [avatarSrc, isTransition] = useHoldValue(participant?.avatar, 500);

    if (!participant) {
      return null;
    }

    return (
      <div
        className={classNames({ fading: isTransition })}
        css={containerStyle}
      >
        <Avatar src={avatarSrc} size="overlay" />
      </div>
    );
  }
);

const containerStyle = css`
  transition: opacity 500ms ease-in-out;
  opacity: 1;

  &.fading {
    opacity: 0;
  }
`;
