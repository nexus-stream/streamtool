import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { stageSelectors } from "../stages/selectors";
import { patchRaceOverrideParticipant } from "../stages/stageSlice";
import { DisplayParticipant } from "./types";

export function useParticipantOverrideState<
  TKey extends keyof DisplayParticipant
>(
  key: TKey,
  stageId: string,
  user: string
): [
  DisplayParticipant[TKey] | undefined,
  (newValue: DisplayParticipant[TKey] | undefined) => void
] {
  const dispatch = useAppDispatch();

  const override = useSelector(stageSelectors.selectEntities)[stageId]
    ?.participantOverrides?.[user]?.[key];

  const setOverride = useCallback(
    (newValue: DisplayParticipant[TKey] | undefined) => {
      dispatch(
        patchRaceOverrideParticipant({
          id: stageId,
          user,
          patch: { [key]: newValue },
        })
      );
    },
    [dispatch, key, stageId, user]
  );

  return [override, setOverride];
}
