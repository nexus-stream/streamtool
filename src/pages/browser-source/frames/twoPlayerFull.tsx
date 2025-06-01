import { buildFrameComponent } from "../frame";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { size } from "../../../style/theme";
import { FRAME_STYLES } from "../components/styles";
import { DisplayPlaceholder } from "../components/DisplayPlaceholder";

export const twoPlayerSquareFrame = buildFrameComponent(
  {
    displayName: "Two Player 4:3",
    width: 1920,
    height: 1080,
  },
  ({ race }) => {
    return (
      <div css={containerStyle}>
        <div css={displayRowStyle}>
          <DisplayPlaceholder aspectRatio="full" />
          <DisplayPlaceholder aspectRatio="full" />
        </div>
      </div>
    );
  }
);

const containerStyle = css`
  ${STYLES.fullSize};
  display: flex;
  flex-direction: column;
`;

const displayRowStyle = css`
  display: flex;
  gap: ${size(2)};
  ${FRAME_STYLES.gradientBkg.twoPlayer.blue};
`;
