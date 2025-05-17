import { createSelector } from "@reduxjs/toolkit";
import { stageAdapter, stageRootSelector } from "./stageSlice";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DisplayRace } from "./types";
import { buildDisplayRace } from "./displayRaceBuilder";

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

const selectCurrentRace = createSelector(
  selectCurrentStage,
  raceSelectors.selectEntities,
  (stage, raceEntities) => {
    if (!stage) {
      return undefined;
    }

    return raceEntities[stage.raceId];
  }
);

const selectCurrentRaceOverrides = createSelector(
  selectCurrentStage,
  (stage) => {
    return stage?.overrides;
  }
);

export const selectCurrentDisplayRace = createSelector(
  selectCurrentRace,
  selectCurrentRaceOverrides,
  userSelectors.selectEntities,
  (race, overrides, userEntities): DisplayRace | undefined => {
    if (!race || !overrides) {
      return;
    }

    return buildDisplayRace(race, overrides, userEntities);
  }
);
