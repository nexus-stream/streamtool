import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { DisplayParticipant, DisplayRace } from "../../../data/display/types";
import {
  useDisplayRaceParticipantTimer,
  useDisplayRaceTimer,
} from "../../../data/display/displayTimerHooks";

const Params = z.object({
  enumType: z.enum(["first", "second", "third"]).default("first"),
});

export const debugFrame = buildFrameComponent(
  {
    displayName: "Debug View",
    width: 400,
    height: 400,
  },
  Params,
  ({ race, enumType }) => {
    const raceTimer = useDisplayRaceTimer(race);

    return (
      <div>
        <p>{JSON.stringify(race)}</p>
        <p>{enumType}</p>
        {race.participants.map((participant) => {
          return (
            <ParticipantTimer
              key={participant.user}
              participant={participant}
              race={race}
            />
          );
        })}
        <p>Race: {raceTimer}</p>
      </div>
    );
  }
);

function ParticipantTimer({
  participant,
  race,
}: {
  participant: DisplayParticipant;
  race: DisplayRace;
}) {
  const time = useDisplayRaceParticipantTimer(participant, race);

  return (
    <p>
      {participant.user}: {time}
    </p>
  );
}
