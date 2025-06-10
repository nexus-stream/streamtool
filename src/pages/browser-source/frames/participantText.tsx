import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { DisplayParticipant, DisplayRace } from "../../../data/display/types";
import { useDisplayRaceParticipantTimer } from "../../../data/display/displayTimerHooks";
import { FrameTypography } from "../../../components/FrameTypography";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  kind: z.enum(["displayName", "pronouns", "time"]).default("displayName"),
  fontSize: z.coerce.number().default(48),
});

export const participantTextFrame = buildFrameComponent(
  {
    displayName: "Participant Text",
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ race, participantPosition, kind, fontSize }) => {
    const participant = race.participants[participantPosition - 1];

    if (!participant) {
      return null;
    }

    switch (kind) {
      case "displayName":
      case "pronouns":
        return (
          <FrameTypography fontSize={fontSize}>
            {participant[kind]}
          </FrameTypography>
        );
      case "time":
        return (
          <ParticipantTextTimer
            participant={participant}
            race={race}
            fontSize={fontSize}
          />
        );
    }
  }
);

// eslint-disable-next-line react-refresh/only-export-components
function ParticipantTextTimer({
  participant,
  race,
  fontSize,
}: {
  participant: DisplayParticipant;
  race: DisplayRace;
  fontSize: number;
}) {
  const time = useDisplayRaceParticipantTimer(participant, race);
  return (
    <FrameTypography style="monospace" fontSize={fontSize}>
      {time}
    </FrameTypography>
  );
}
