import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import {
  FrameTypography,
  TypographyParamsWithDefault,
} from "../components/FrameTypography";
import { useSelector } from "react-redux";
import { selectCurrentStage } from "../../../data/stages/selectors";

const Params = z.object({
  tagName: z.string().default(""),
  settings: TypographyParamsWithDefault,
});

export const tagTextFrame = buildFrameComponent(
  {
    displayName: "Tag Text",
    defaultName: ({ tagName }) => (tagName ? `Tag: ${tagName}` : ""),
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ tagName, settings }) => {
    const stage = useSelector(selectCurrentStage);
    const text = stage?.tags?.[tagName] ?? "";

    return (
      <FrameTypography
        settings={settings}
        text={text}
        transitionHoldKey={`${stage?.id}:${text}`}
      />
    );
  }
);
