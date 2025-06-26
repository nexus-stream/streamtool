import { useSelector } from "react-redux";
import {
  selectCurrentDisplayRace,
  selectCurrentRaceResults,
} from "../../../data/display/selectors";

export function useParticipantAtPosition(
  positionType: "manual" | "results",
  participantPosition: number
) {
  const race = useSelector(selectCurrentDisplayRace);
  const results = useSelector(selectCurrentRaceResults);

  if (!race || !results) {
    return undefined;
  }

  const orderedParticipants =
    positionType === "manual" ? race.participants : results;
  return orderedParticipants[participantPosition - 1];
}
