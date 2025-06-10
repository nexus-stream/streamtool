import { css } from "@emotion/react";
import { ReactNode } from "react";
import { Textfit } from "@ataverascrespo/react18-ts-textfit";
import { STYLES } from "./styles";

interface Props {
  style?: "sans-serif" | "monospace";
  fontSize: number;
  children: ReactNode;
}

export function FrameTypography({
  style = "sans-serif",
  fontSize,
  children,
}: Props) {
  return (
    <div css={containerStyle}>
      <div css={textStyles[style]}>
        <Textfit mode="single" max={fontSize}>
          {children}
        </Textfit>
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  align-items: center;
  ${STYLES.fullHeight};
`;

const baseStyle = css`
  min-width: 0;
  flex-grow: 1;
`;

const textStyles = {
  "sans-serif": css`
    ${baseStyle};
    font-family: "Jockey One", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-variant-numeric: tabular-nums;
  `,
  monospace: css`
    ${baseStyle};
    font-family: "IBM Plex Mono", monospace;
    font-weight: 700;
    font-style: normal;
  `,
};
