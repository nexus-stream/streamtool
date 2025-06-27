import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { patchRaceOverrides } from "../stages/stageSlice";
import { DisplayRace } from "./race/types";
import { useRaceStage } from "../stages/useRaceStage";

// Gets a useState like interface for reading and updating the override state for
// a race value for a given stage. This lets us easily define components meant to
// edit these values by just passing in a stage id and the parameter that we want
// to edit.
export function useRaceOverrideState<TParam extends keyof DisplayRace>(
  param: TParam,
  stageId: string
): [
  DisplayRace[TParam] | undefined,
  (newValue: DisplayRace[TParam] | undefined) => void
] {
  const dispatch = useAppDispatch();

  const stage = useRaceStage(stageId);
  const override = stage?.raceOverrides?.[param];

  const setOverride = useCallback(
    (newValue: DisplayRace[TParam] | undefined) => {
      dispatch(
        patchRaceOverrides({ id: stageId, patch: { [param]: newValue } })
      );
    },
    [dispatch, param, stageId]
  );

  return [override, setOverride];
}
