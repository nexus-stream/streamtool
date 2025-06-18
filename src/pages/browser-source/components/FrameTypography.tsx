import { css } from "@emotion/react";
import { Textfit } from "@ataverascrespo/react18-ts-textfit";
import { STYLES } from "../../../components/styles";
import classNames from "classnames";
import { useHoldValue } from "../../../components/useHoldValue";

interface BaseProps {
  style?: "sans-serif" | "monospace";
  fontSize: number;
  text: string;
  transitionHoldKey?: string;
  // Can manually control transition
  isFading?: boolean;
}

interface Props extends BaseProps {
  skipTransition?: boolean;
}

export function FrameTypography({ skipTransition, ...baseProps }: Props) {
  if (skipTransition) {
    return <FrameTypographyBase {...baseProps} />;
  } else {
    return <FrameTypographyWithTransition {...baseProps} />;
  }
}

export function FrameTypographyWithTransition({
  text,
  transitionHoldKey,
  ...restProps
}: BaseProps) {
  // move outside so this doesn't get used for timers
  const [displayText, isFading] = useHoldValue(text, transitionHoldKey ?? text);

  return (
    <FrameTypographyBase
      {...restProps}
      isFading={isFading}
      text={displayText}
    />
  );
}

export function FrameTypographyBase({
  style = "sans-serif",
  fontSize,
  text,
  isFading,
}: BaseProps) {
  return (
    <div className={classNames({ fading: isFading })} css={containerStyle}>
      <div css={textStyles[style]}>
        <Textfit mode="single" max={fontSize}>
          {text}
        </Textfit>
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  align-items: center;
  ${STYLES.fullHeight};
  transition: opacity 400ms ease-in-out;
  transition-delay: 100ms;
  opacity: 1;

  &.fading {
    opacity: 0;
    transition-delay: 100ms;
  }
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
