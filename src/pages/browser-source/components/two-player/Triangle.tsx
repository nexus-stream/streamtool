import { css } from "@emotion/react";
import { FRAME_STYLES } from "../styles";

type TriangleKind = "ulbr" | "urbl";

export interface Props {
  kind: TriangleKind;
}

export function Triangle({ kind }: Props) {
  return (
    <div css={containerStyle}>
      <div css={triangleStyles[kind]} />
    </div>
  );
}

const containerStyle = css`
  width: 64px;
  ${FRAME_STYLES.gradientBkg.twoPlayer.gray};
`;

const baseTriangleStyle = css`
  width: 100%;
  height: 100%;
  ${FRAME_STYLES.gradientBkg.twoPlayer.blue};
`;

const triangleStyles = {
  urbl: css`
    ${baseTriangleStyle};
    clip-path: polygon(0 0, 0 100%, 100% 0);
  `,
  ulbr: css`
    ${baseTriangleStyle}
    clip-path: polygon(0 0, 100% 100%, 100% 0);
  `,
};
