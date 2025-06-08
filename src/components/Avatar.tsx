import AvatarFallback from "../assets/avatar-fallback.png";
import { css } from "@emotion/react";
import { size } from "../style/theme";
import { STYLES } from "./styles";

interface Props {
  src: string | null | undefined;
  size: "small" | "medium" | "large";
}

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
};
