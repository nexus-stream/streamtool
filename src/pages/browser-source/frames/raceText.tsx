import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { DisplayRace } from "../../../data/display/types";
import { useDisplayRaceTimer } from "../../../data/display/displayTimerHooks";
import {
  FrameTypography,
  TypographyParamsWithDefault,
} from "../components/FrameTypography";

const Params = z.object({
  kind: z.enum(["game", "category", "time"]).default("game"),
  settings: TypographyParamsWithDefault,
});

export const raceTextFrame = buildFrameComponent(
  {
    displayName: "Race Text",
    defaultName: ({ kind }) => `${kind}`,
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ race, kind, settings }) => {
    switch (kind) {
      case "game":
      case "category":
        return (
          <FrameTypography
            settings={settings}
            text={race[kind] ?? ""}
            transitionHoldKey={race.raceId}
          />
        );
      case "time":
        return <RaceTextTimer race={race} settings={settings} />;
    }
  }
);

// eslint-disable-next-line react-refresh/only-export-components
function RaceTextTimer({
  race,
  settings,
}: {
  race: DisplayRace;
  settings: z.infer<typeof TypographyParamsWithDefault>;
}) {
  const time = useDisplayRaceTimer(race);
  return (
    <FrameTypography
      settings={settings}
      text={time}
      transitionHoldKey={race.raceId}
    />
  );
}
