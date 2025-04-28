import { createSelector } from "@reduxjs/toolkit";
import { rootSelector } from "./store";
import { stagesSelectors } from "./stageSlice";

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
