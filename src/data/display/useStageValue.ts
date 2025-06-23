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

export function useStageValue<
  TParam extends keyof TStage,
  TStage extends Stage
>(
  stageId: string,
  param: TParam
): [TStage[TParam], (val: TStage[TParam]) => void] {
  const dispatch = useAppDispatch();
  const stage = useSelector(stageSelectors.selectEntities)[stageId];

  const setter = useCallback(
    (newValue: TStage[TParam]) => {
      dispatch(updateStage({ id: stageId, changes: { [param]: newValue } }));
    },
    [dispatch, param, stageId]
  );

  if (!stage) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return FALLBACK_VALUE as any;
  }

  return [(stage as TStage)[param], setter];
}

export function useStageStringValue<
  TParam extends keyof StringValuesOnly<TStage>,
  TStage extends Stage
>(stageId: string, param: TParam): [string, (val: string) => void] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useStageValue(stageId, param) as any;
}
