import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { DisplayRace } from "../../../data/display/types";
import { useDisplayRaceTimer } from "../../../data/display/displayTimerHooks";
import { FrameTypography } from "../../../components/FrameTypography";

const Params = z.object({
  kind: z.enum(["game", "category", "time"]).default("game"),
  fontSize: z.coerce.number().default(48),
});

export const raceTextFrame = buildFrameComponent(
  {
    displayName: "Race Text",
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ race, kind, fontSize }) => {
    switch (kind) {
      case "game":
      case "category":
        return (
          <FrameTypography fontSize={fontSize}>{race[kind]}</FrameTypography>
        );
      case "time":
        return <RaceTextTimer race={race} fontSize={fontSize} />;
    }
  }
);

// eslint-disable-next-line react-refresh/only-export-components
function RaceTextTimer({
  race,
  fontSize,
}: {
  race: DisplayRace;
  fontSize: number;
}) {
  const time = useDisplayRaceTimer(race);
  return (
    <FrameTypography style="monospace" fontSize={fontSize}>
      {time}
    </FrameTypography>
  );
}
