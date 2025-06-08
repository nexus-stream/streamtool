import { css } from "@emotion/react";
import { DisplayParticipant } from "../../../../data/display/types";
import { FRAME_STYLES } from "../styles";
import { size } from "../../../../style/theme";
import { Avatar } from "../../../../components/Avatar";

interface Props {
  participant: DisplayParticipant;
}

export function ParticipantAvatar({ participant }: Props) {
  return (
    <div css={containerStyle}>
      <Avatar size="large" src={participant.avatar} />
    </div>
  );
}

const containerStyle = css`
  display: flex;
  align-items: center;
  ${FRAME_STYLES.gradientBkg.twoPlayer.gray};
  /* padding: ${size(2)}; */
`;
