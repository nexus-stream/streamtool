import { css } from "@emotion/react";
import { size } from "../style/theme";
import { STYLES } from "../style/styles";

interface Props {
  discordId?: string;
  size?: "small" | "medium" | "large" | "overlay";
}

export function CommentatorDiscord({ discordId, size: avatarSize = "overlay" }: Props) {
  if (!discordId) {
    return null;
  }

  return (
    <div css={[containerStyle, sizedStyles[avatarSize]]}>
      <img
        css={fallbackIconStyle}
        src="/Discord-Symbol-Blurple.png"
        alt="Discord"
      />
      <iframe
        css={iframeStyle}
        src={`https://reactive.fugi.tech/basic/${discordId}`}
      />
    </div>
  );
}

const containerStyle = css`
  ${STYLES.roundedCorners};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const sizedStyles = {
  small: css`
    width: ${size(8)};
    height: ${size(8)};
  `,
  medium: css`
    width: ${size(12)};
    height: ${size(12)};
  `,
  large: css`
    width: ${size(20)};
    height: ${size(20)};
  `,
  overlay: css`
    ${STYLES.fullSize};
  `,
};

const fallbackIconStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: calc(16 / 240 * 100%);
  box-sizing: border-box;
  object-fit: contain;
  pointer-events: none;
`;

const iframeStyle = css`
  ${STYLES.fullSize};
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border: none;
`;
