import { useSelector } from "react-redux";
import { stageSelectors } from "../stages/selectors";
import { Stage } from "../stages/types";
import { useAppDispatch } from "../hooks";
import { useCallback } from "react";
import { updateStage } from "../stages/stageSlice";

const FALLBACK_VALUE: [string, (val: string) => void] = [
  "EMPTY STAGE",
  () => {},
];

export type StringValuesOnly<T> = {
  [K in keyof T as T[K] extends string | undefined ? K : never]: T[K];
};

export function useStageStringValue<
  TParam extends keyof StringValuesOnly<TStage>,
  TStage extends Stage
>(stageId: string, param: TParam): [string, (val: string) => void] {
  const dispatch = useAppDispatch();
  const stage = useSelector(stageSelectors.selectEntities)[stageId];

  const setter = useCallback(
    (newValue: string) => {
      dispatch(updateStage({ id: stageId, changes: { [param]: newValue } }));
    },
    [dispatch, param, stageId]
  );

  if (!stage) {
    return FALLBACK_VALUE;
  }

  return [(stage[param] as string) ?? "", setter];
}
