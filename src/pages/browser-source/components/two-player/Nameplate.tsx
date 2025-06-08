import { css } from "@emotion/react";
import { DisplayParticipant } from "../../../../data/display/types";
import { FRAME_STYLES } from "../styles";

type Side = "left" | "right";

interface Props {
  participant: DisplayParticipant;
  side: Side;
}

export function Nameplate({ participant, side }: Props) {
  return (
    <div className={side} css={containerStyle}>
      <div>
        <p>{participant.displayName}</p>
        <p>{participant.pronouns}</p>
      </div>
    </div>
  );
}

const containerStyle = css`
  ${FRAME_STYLES.gradientBkg.twoPlayer.blue};
  display: flex;
  width: 386px;

  &.right {
    justify-content: end;

    div {
      text-align: right;
    }
  }
`;
