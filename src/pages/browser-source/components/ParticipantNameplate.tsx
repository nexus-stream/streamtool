import { useDisplayRaceParticipantTimer } from "../../../data/display/displayTimerHooks";
import { DisplayParticipant, DisplayRace } from "../../../data/display/types";
import { ParticipantTimer } from "./ParticipantTimer";

interface Props {
  participant: DisplayParticipant;
  race: DisplayRace;
}

export function ParticipantNameplate({ participant, race }: Props) {
  const time = useDisplayRaceParticipantTimer(participant, race);

  return (
    <div className="flex align-middle bg-indigo-800 p-2 h-full">
      <div className="flex flex-col justify-center">
        <p className="text-lg font-bold">{participant.displayName}</p>
        {participant.pronouns && (
          <p className="text-sm">{participant.pronouns}</p>
        )}
      </div>
      <ParticipantTimer className="ml-auto" time={time} />
    </div>
  );
}
