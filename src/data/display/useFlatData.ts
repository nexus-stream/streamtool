import { useSelector } from "react-redux";
import { flattenObj } from "../../components/flattenObj";
import {
  selectCurrentStage,
  selectCurrentPatchedDisplayRace,
} from "../stages/selectors";
import { useMemo } from "react";

export function useFlatData() {
  const stage = useSelector(selectCurrentStage);
  const race = useSelector(selectCurrentPatchedDisplayRace);
  return useMemo(() => flattenObj({ stage, race }), [stage, race]);
}
