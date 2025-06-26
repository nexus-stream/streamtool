import AvatarFallback from "../assets/avatar-fallback.png";
import { css } from "@emotion/react";
import { size } from "../style/theme";
import { STYLES } from "../style/styles";

interface Props {
  src: string | null | undefined;
  size: "small" | "medium" | "large" | "overlay";
}

// Shared Avatar component for both the stream tool and browser sources.
export function Avatar({ src, size }: Props) {
  return (
    <img
      css={[baseAvatarStyle, sizedAvatarStyles[size]]}
      src={src ?? AvatarFallback}
    />
  );
}

const baseAvatarStyle = css`
  ${STYLES.roundedCorners};
`;

const sizedAvatarStyles = {
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
    width: 240px;
    height: 240px;
    border-radius: 32px;
  `,
};
