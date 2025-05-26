import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { stageSelectors } from "../stages/selectors";
import { patchRaceOverrideParticipant } from "../stages/stageSlice";
import { DisplayParticipant } from "./types";

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

  const override = useSelector(stageSelectors.selectEntities)[stageId]
    ?.participantOverrides?.[user]?.[param];

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
