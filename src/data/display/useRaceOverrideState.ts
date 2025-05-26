import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { stageSelectors } from "../stages/selectors";
import { patchRaceOverrides } from "../stages/stageSlice";
import { DisplayRace } from "./types";

export function useRaceOverrideState<TKey extends keyof DisplayRace>(
  key: TKey,
  stageId: string
): [
  DisplayRace[TKey] | undefined,
  (newValue: DisplayRace[TKey] | undefined) => void
] {
  const dispatch = useAppDispatch();

  const override = useSelector(stageSelectors.selectEntities)[stageId]
    ?.raceOverrides?.[key];

  const setOverride = useCallback(
    (newValue: DisplayRace[TKey] | undefined) => {
      dispatch(patchRaceOverrides({ id: stageId, patch: { [key]: newValue } }));
    },
    [dispatch, key, stageId]
  );

  return [override, setOverride];
}
