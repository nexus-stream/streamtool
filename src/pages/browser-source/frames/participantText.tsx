import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { useDisplayRaceParticipantTimer } from "../../../data/display/timer/displayTimerHooks";
import {
  FrameTypography,
  TypographyParamsWithDefault,
} from "../components/FrameTypography";
import { DisplayRace } from "../../../data/display/participant/types";
import { DisplayParticipant } from "../../../data/display/race/types";
import { useParticipantAtPosition } from "../hooks/useParticipantAtPosition";
import { useSelector } from "react-redux";
import { selectCurrentStageId } from "../../../data/stages/selectors";
import { selectCurrentDisplayRace } from "../../../data/display/selectors";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
  positionType: z.enum(["manual", "results"]).default("manual"),
  kind: z
    .enum(["displayName", "pronouns", "time", "pb"])
    .default("displayName"),
  settings: TypographyParamsWithDefault,
});

export const participantTextFrame = buildFrameComponent(
  {
    displayName: "Participant Text",
    defaultName: ({ participantPosition, kind }) =>
      `Participant ${participantPosition} ${kind}`,
    width: 420,
    height: 80,
    autoResize: true,
  },
  Params,
  ({ participantPosition, positionType, kind, settings }) => {
    const stageId = useSelector(selectCurrentStageId);
    const race = useSelector(selectCurrentDisplayRace);
    const participant = useParticipantAtPosition(
      positionType,
      participantPosition
    );

    if (!participant) {
      return null;
    }

    switch (kind) {
      case "displayName":
      case "pronouns":
      case "pb":
        return (
          <FrameTypography
            settings={settings}
            text={participant[kind] ?? ""}
            transitionHoldKey={`${stageId}:${participant.user}`}
          />
        );
      case "time":
        return (
          <ParticipantTextTimer
            participant={participant}
            race={race!}
            settings={settings}
          />
        );
    }
  }
);

// eslint-disable-next-line react-refresh/only-export-components
function ParticipantTextTimer({
  participant,
  race,
  settings,
}: {
  participant: DisplayParticipant;
  race: DisplayRace;
  settings: z.infer<typeof TypographyParamsWithDefault>;
}) {
  // useHoldValue for the value here of the participant's user and the race id
  const time = useDisplayRaceParticipantTimer(participant, race);
  return (
    <FrameTypography
      settings={settings}
      text={time}
      transitionHoldKey={`${race.raceId}:${participant.user}`}
    />
  );
}
