import { useSelector } from "react-redux";
import { flattenObj } from "../../components/flattenObj";
import {
  selectCurrentStage,
  selectCurrentPatchedDisplayRace,
} from "../stages/selectors";
import { useMemo } from "react";
import { getResultParticipants } from "../../pages/browser-source/components/getParticipantFromPosition";

export function useFlatData() {
  const stage = useSelector(selectCurrentStage);
  const race = useSelector(selectCurrentPatchedDisplayRace);
  const results = race ? getResultParticipants(race.participants) : undefined;
  return useMemo(
    () => flattenObj({ stage, race, results }),
    [stage, race, results]
  );
}
