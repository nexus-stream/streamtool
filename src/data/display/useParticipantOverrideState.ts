import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { patchRaceOverrideParticipant } from "../stages/stageSlice";
import { useRaceStage } from "../stages/useRaceStage";
import { DisplayParticipant } from "./race/types";

export function useParticipantOverrideState<
  TParam extends keyof DisplayParticipant
>(
  param: TParam,
  stageId: string,
  user: string
): [
  DisplayParticipant[TParam] | undefined,
  (newValue: DisplayParticipant[TParam] | undefined) => void
] {
  const dispatch = useAppDispatch();

  const stage = useRaceStage(stageId);

  const override = stage?.participantOverrides?.[user]?.[param];

  const setOverride = useCallback(
    (newValue: DisplayParticipant[TParam] | undefined) => {
      dispatch(
        patchRaceOverrideParticipant({
          id: stageId,
          user,
          patch: { [param]: newValue },
        })
      );
    },
    [dispatch, param, stageId, user]
  );

  return [override, setOverride];
}
