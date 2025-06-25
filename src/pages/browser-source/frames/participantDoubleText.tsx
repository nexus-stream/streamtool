import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import {
  TYPOGRAPHY_PARAMS_DEFAULT,
  TypographyParamsNoDefault,
} from "../components/FrameTypography";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { participantTextFrame } from "./participantText";
import { FC } from "react";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  positionType: z.enum(["manual", "results"]).default("manual"),
  gap: z.coerce.number().default(0),
  halign: z.enum(["left", "center", "right"]).default("left"),
  leftKind: z.enum(["displayName", "pronouns", "time"]).default("displayName"),
  leftSettings: TypographyParamsNoDefault.omit({ halign: true }).default(
    TYPOGRAPHY_PARAMS_DEFAULT
  ),
  rightKind: z.enum(["displayName", "pronouns", "time"]).default("pronouns"),
  rightSettings: TypographyParamsNoDefault.omit({ halign: true }).default(
    TYPOGRAPHY_PARAMS_DEFAULT
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InnerFrame = participantTextFrame.fc as FC<any>;

export const participantDoubleTextFrame = buildFrameComponent(
  {
    displayName: "Participant Double Text",
    defaultName: ({ participantPosition, leftKind, rightKind }) =>
      `Participant ${participantPosition} ${leftKind} + ${rightKind}`,
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({
    leftKind,
    leftSettings,
    rightKind,
    rightSettings,
    gap,
    halign,
    ...rest
  }) => {
    return (
      <div
        css={[containerStyle, containerHalignStyles[halign]]}
        style={{ gap }}
      >
        <InnerFrame kind={leftKind} settings={leftSettings} {...rest} />
        <InnerFrame kind={rightKind} settings={rightSettings} {...rest} />
      </div>
    );
  }
);

const containerStyle = css`
  display: flex;
  ${STYLES.fullHeight};
  ${STYLES.fullWidth};
`;

const containerHalignStyles = {
  left: css`
    justify-content: start;
  `,
  center: css`
    justify-content: center;
  `,
  right: css`
    justify-content: end;
  `,
};
