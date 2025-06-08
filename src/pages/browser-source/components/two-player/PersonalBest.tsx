import { css } from "@emotion/react";
import { FRAME_STYLES } from "../styles";
import { formatTimer } from "../../../../data/display/displayTimerHooks";

interface Props {
  pb: string | null;
}

export function PersonalBest({ pb }: Props) {
  return (
    <div css={containerStyle}>
      {pb && (
        <>
          <p>Personal Best</p>
          <p>{formatTimer(pb)}</p>
        </>
      )}
    </div>
  );
}

const containerStyle = css`
  ${FRAME_STYLES.gradientBkg.twoPlayer.gray};
  width: 192px;
  text-align: center;
`;
