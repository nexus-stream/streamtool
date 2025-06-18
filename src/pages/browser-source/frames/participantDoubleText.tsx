import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { TypographyParams } from "../components/FrameTypography";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { participantTextFrame } from "./participantText";
import { FC } from "react";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  gap: z.coerce.number().default(0),
  leftKind: z.enum(["displayName", "pronouns", "time"]).default("displayName"),
  leftSettings: TypographyParams,
  rightKind: z.enum(["displayName", "pronouns", "time"]).default("pronouns"),
  rightSettings: TypographyParams,
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
  ({ leftKind, leftSettings, rightKind, rightSettings, gap, ...rest }) => {
    return (
      <div css={containerStyle} style={{ gap }}>
        <InnerFrame kind={leftKind} settings={leftSettings} {...rest} />
        <InnerFrame kind={rightKind} settings={rightSettings} {...rest} />
      </div>
    );
  }
);

const containerStyle = css`
  display: flex;
  ${STYLES.fullHeight};
`;
