import { createSelector } from "@reduxjs/toolkit";
import { stageAdapter, stageRootSelector } from "./stageSlice";

export const stageSelectors = stageAdapter.getSelectors(stageRootSelector);

export const selectCurrentStageId = createSelector(
  stageRootSelector,
  (stages) => stages.currentStageId
);

export const selectCurrentStage = createSelector(
  stageSelectors.selectEntities,
  selectCurrentStageId,
  (entities, stageId) => {
    if (!stageId) {
      return undefined;
    }

    return entities[stageId];
  }
);

export const selectPreviousStage = createSelector(
  stageSelectors.selectIds,
  stageSelectors.selectAll,
  selectCurrentStageId,
  (stageIds, stages, stageId) => {
    if (!stageId) {
      return undefined;
    }

    const currentStageIndex = stageIds.indexOf(stageId);
    return stages[currentStageIndex - 1];
  }
);

export const selectNextStage = createSelector(
  stageSelectors.selectIds,
  stageSelectors.selectAll,
  selectCurrentStageId,
  (stageIds, stages, stageId) => {
    if (!stageId) {
      return undefined;
    }

    const currentStageIndex = stageIds.indexOf(stageId);
    return stages[currentStageIndex + 1];
  }
);

export const selectAllStageTagNames = createSelector(
  stageSelectors.selectAll,
  (stages) => {
    const tagNames = new Set<string>();
    for (const stage of stages) {
      for (const name of Object.keys(stage.tags ?? {})) {
        tagNames.add(name);
      }
    }
    return [...tagNames].sort();
  }
);
