import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { TypographyParams } from "../components/FrameTypography";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { FC } from "react";
import { commentatorTextFrame } from "./commentatorText";

const Params = z.object({
  commentatorPosition: z.coerce.number().default(1),
  gap: z.coerce.number().default(0),
  leftKind: z.enum(["user", "pronouns"]).default("user"),
  leftSettings: TypographyParams,
  rightKind: z.enum(["user", "pronouns"]).default("pronouns"),
  rightSettings: TypographyParams,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InnerFrame = commentatorTextFrame.fc as FC<any>;

export const commentatorDoubleTextFrame = buildFrameComponent(
  {
    displayName: "Commentator Double Text",
    defaultName: ({ commentatorPosition, leftKind, rightKind }) =>
      `Commentator ${commentatorPosition} ${leftKind} + ${rightKind}`,
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
