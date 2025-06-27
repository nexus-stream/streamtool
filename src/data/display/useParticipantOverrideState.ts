import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { patchRaceOverrideParticipant } from "../stages/stageSlice";
import { useRaceStage } from "../stages/useRaceStage";
import { DisplayParticipant } from "./participant/types";

// Gets a useState like interface for reading and updating the override state for
// a participant value for a given stage / user. This lets us easily define components
// meant to edit these values by just passing in a stage id and the parameter that we
// want to edit.
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
