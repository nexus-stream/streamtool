import { createSelector } from "@reduxjs/toolkit";
import { rootSelector } from "./store";
import { stagesSelectors } from "./stageSlice";
import { produce } from "immer";

export const selectCurrentStageId = createSelector(
  rootSelector,
  (state) => state.stages.currentStageId
);

export const selectCurrentStage = createSelector(
  stagesSelectors.selectEntities,
  selectCurrentStageId,
  (entities, stageId) => {
    if (!stageId) {
      return undefined;
    }

    return entities[stageId];
  }
);

const selectCurrentRaceInfo = createSelector(selectCurrentStage, (stage) => {
  if (!stage) {
    return undefined;
  }

  return stage.raceInfo;
});

const selectCurrentRaceInfoOverrides = createSelector(
  selectCurrentStage,
  (stage) => {
    if (!stage) {
      return undefined;
    }

    return stage.raceInfoOverrides;
  }
);

export const selectCurrentRace = createSelector(
  selectCurrentRaceInfo,
  selectCurrentRaceInfoOverrides,
  (raceInfo, overrides) => {
    if (!raceInfo || !overrides) {
      return undefined;
    }

    return produce(raceInfo, (draftState) => {
      draftState.game = overrides.game ?? draftState.game;
      draftState.category = overrides.category ?? draftState.category;

      for (const [user, patch] of Object.entries(
        overrides.participantPatches ?? {}
      )) {
        const userIndex = draftState.participants.findIndex(
          (participant) => participant.user === user
        );
        if (userIndex === -1) {
          continue;
        }

        draftState.participants[userIndex] = {
          ...draftState.participants[userIndex],
          ...patch,
        };
      }

      draftState.timerInfo = overrides.timerInfo ?? draftState.timerInfo;
    });
  }
);
