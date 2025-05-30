import AvatarFallback from "../assets/avatar-fallback.png";
import { css } from "@emotion/react";
import { spacing } from "../style/theme";
import { roundedCorners } from "./primitives";

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
  ${roundedCorners};
`;

const sizedAvatarStyles = {
  small: css`
    width: ${spacing(8)};
    height: ${spacing(8)};
  `,
  medium: css`
    width: ${spacing(12)};
    height: ${spacing(12)};
  `,
  large: css`
    width: ${spacing(16)};
    height: ${spacing(16)};
  `,
};
