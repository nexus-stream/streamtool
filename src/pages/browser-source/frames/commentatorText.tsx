import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import {
  FrameTypography,
  TypographyParamsWithDefault,
} from "../components/FrameTypography";
import { useSelector } from "react-redux";
import { selectCurrentDisplayRace } from "../../../data/display/selectors";

const Params = z.object({
  commentatorPosition: z.coerce.number().default(1),
  kind: z.enum(["user", "pronouns"]).default("user"),
  settings: TypographyParamsWithDefault,
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
  ({ commentatorPosition, kind, settings }) => {
    const race = useSelector(selectCurrentDisplayRace);

    const commentator = race?.commentators[commentatorPosition - 1];

    if (!commentator) {
      return null;
    }

    return (
      <FrameTypography
        settings={settings}
        text={commentator[kind] ?? ""}
        transitionHoldKey={`${race.raceId}:${commentator.user}`}
      />
    );
  }
);
