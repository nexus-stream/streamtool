import { css } from "@emotion/react";
import { Textfit } from "@ataverascrespo/react18-ts-textfit";
import { STYLES } from "../../../style/styles";
import classNames from "classnames";
import {
  transitionHoldStyle,
  useTransitionHoldValue,
} from "../../../util/useTransitionHoldValue";
import { z } from "zod/v4";
import { ReactNode } from "react";

export const TypographyParamsNoDefault = z.object({
  fontSize: z.coerce.number().default(48),
  family: z.enum(["sans-serif", "monospace"]).default("sans-serif"),
  customFamily: z.string().default(""),
  style: z.enum(["normal", "italics"]).default("normal"),
  color: z.string().default("#FFFFFF"),
  stroke: z.coerce.number().default(0),
  strokeColor: z.string().default("transparent"),
  halign: z.enum(["left", "center", "right"]).default("left"),
  valign: z.enum(["top", "middle", "bottom"]).default("middle"),
});

// eslint-disable-next-line react-refresh/only-export-components
export const TYPOGRAPHY_PARAMS_DEFAULT = TypographyParamsNoDefault.parse({});

export const TypographyParamsWithDefault = TypographyParamsNoDefault.default(
  TYPOGRAPHY_PARAMS_DEFAULT
);

interface Props {
  text: string;
  transitionHoldKey?: string;

  settings: z.infer<typeof TypographyParamsWithDefault>;
}

export function FrameTypography({
  text,
  transitionHoldKey,
  ...restProps
}: Props) {
  const [displayText, isFading] = useTransitionHoldValue(
    text,
    transitionHoldKey ?? text
  );

  return (
    <FrameTypographyBase
      {...restProps}
      isFading={isFading}
      text={displayText}
    />
  );
}

function FrameTypographyBase({
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
  },
}: Props & { isFading: boolean }) {
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
  ${transitionHoldStyle};
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
