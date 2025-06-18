import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { FrameTypography } from "../components/FrameTypography";

const Params = z.object({
  commentatorPosition: z.coerce.number().default(1),
  kind: z.enum(["user", "pronouns"]).default("user"),
  fontSize: z.coerce.number().default(48),
});

export const commentatorTextFrame = buildFrameComponent(
  {
    displayName: "Commentator Text",
    defaultName: ({ commentatorPosition, kind }) =>
      `Commentator ${commentatorPosition} ${kind}`,
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ race, commentatorPosition, kind, fontSize }) => {
    const commentator = race.commentators[commentatorPosition - 1];

    if (!commentator) {
      return null;
    }

    return (
      <FrameTypography
        fontSize={fontSize}
        text={commentator[kind] ?? ""}
        transitionHoldKey={`${race.raceId}:${commentator.user}`}
      />
    );
  }
);
