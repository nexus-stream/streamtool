import { css } from "@emotion/react";
import { Textfit } from "@ataverascrespo/react18-ts-textfit";
import { STYLES } from "../../../components/styles";
import classNames from "classnames";
import { useHoldValue } from "../../../components/useHoldValue";
import { z } from "zod/v4";
import { ReactNode } from "react";

export const TypographyParamsNoDefault = z.object({
  fontSize: z.coerce.number(),
  family: z.enum(["sans-serif", "monospace"]),
  customFamily: z.string(),
  style: z.enum(["normal", "italics"]),
  color: z.string(),
  stroke: z.coerce.number(),
  strokeColor: z.string(),
  halign: z.enum(["left", "center", "right"]),
  valign: z.enum(["top", "middle", "bottom"]),
  // shrinkToFit: z.enum(["yes", "no"]),
});

// eslint-disable-next-line react-refresh/only-export-components
export const TYPOGRAPHY_PARAMS_DEFAULT = {
  fontSize: 48,
  family: "sans-serif",
  customFamily: "",
  style: "normal",
  color: "#FFFFFF",
  stroke: 0,
  strokeColor: "transparent",
  halign: "left",
  valign: "middle",
  // shrinkToFit: "no",
} as const;

export const TypographyParamsWithDefault = TypographyParamsNoDefault.default(
  TYPOGRAPHY_PARAMS_DEFAULT
);

interface BaseProps {
  text: string;
  transitionHoldKey?: string;
  // Can manually control transition
  isFading?: boolean;

  settings: z.infer<typeof TypographyParamsWithDefault>;
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
  text,
  isFading,
  settings: {
    fontSize,
    family,
    customFamily,
    style,
    color,
    stroke,
    strokeColor,
    halign,
    valign,
    // shrinkToFit,
  },
}: BaseProps) {
  const cssStyles = [
    baseTextStyle,
    textStyleStyles[style],
    textHalignStyles[halign],
    textValignStyles[valign],
  ];

  if (!customFamily) {
    cssStyles.push(textFamilyStyles[family]);
  }

  return (
    <div className={classNames({ fading: isFading })} css={containerStyle}>
      <div
        css={cssStyles}
        style={{
          color,
          WebkitTextStroke:
            stroke === 0 ? undefined : `${stroke}px ${strokeColor}`,
          paintOrder: stroke === 0 ? undefined : "stroke fill",
          fontFamily: customFamily ? customFamily : undefined,
        }}
      >
        <MaybeFitText fontSize={fontSize} shrinkToFit="no">
          {text}
        </MaybeFitText>
      </div>
    </div>
  );
}

function MaybeFitText({
  shrinkToFit,
  fontSize,
  children,
}: {
  shrinkToFit: "yes" | "no";
  fontSize: number;
  children: ReactNode;
}) {
  switch (shrinkToFit) {
    case "yes":
      return (
        <Textfit mode="single" max={fontSize}>
          {children}
        </Textfit>
      );
    case "no":
      return <span style={{ fontSize }}>{children}</span>;
  }
}

const containerStyle = css`
  display: flex;
  ${STYLES.fullHeight};
  transition: opacity 400ms ease-in-out;
  transition-delay: 100ms;
  opacity: 1;

  &.fading {
    opacity: 0;
    transition-delay: 100ms;
  }
`;

const baseTextStyle = css`
  min-width: 0;
  flex-grow: 1;
`;

const textFamilyStyles = {
  "sans-serif": css`
    font-family: "Jockey One", sans-serif;
    font-weight: 400;
    font-style: normal;
  `,
  monospace: css`
    font-family: "IBM Plex Mono", monospace;
    font-weight: 700;
    font-style: normal;
  `,
};

const textStyleStyles = {
  normal: css``,
  italics: css`
    font-style: italic;
  `,
};

const textHalignStyles = {
  left: css`
    text-align: left;
  `,
  center: css`
    text-align: center;
  `,
  right: css`
    text-align: right;
  `,
};

const textValignStyles = {
  top: css`
    align-self: start;
  `,
  middle: css`
    align-self: center;
  `,
  bottom: css`
    align-self: end;
  `,
};
