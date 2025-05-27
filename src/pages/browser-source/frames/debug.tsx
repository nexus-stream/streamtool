import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { useDisplayRaceTimer } from "../../../data/display/displayTimerHooks";
import { ParticipantNameplate } from "../components/ParticipantNameplate";

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
            // <ParticipantTimerWrapper
            //   key={participant.user}
            //   participant={participant}
            //   race={race}
            // />
            <ParticipantNameplate
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
