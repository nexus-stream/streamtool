import { createSelector } from "@reduxjs/toolkit";
import { editorRootSelector } from "./editorSlice";
import { stageSelectors } from "../stages/selectors";

export const selectCurrentEditorStage = createSelector(
  editorRootSelector,
  stageSelectors.selectEntities,
  ({ currentStageId }, stageEntities) => {
    if (!currentStageId) {
      return undefined;
    }

    return stageEntities[currentStageId];
  }
);
