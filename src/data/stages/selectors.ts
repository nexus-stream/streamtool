import { createSelector } from "@reduxjs/toolkit";
import { stageAdapter, stageRootSelector } from "./stageSlice";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DisplayRace } from "../display/types";
import { buildDisplayRace } from "../display/buildDisplayRace";

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

export const selectCurrentPatchedDisplayRace = createSelector(
  selectCurrentStage,
  selectCurrentRace,
  userSelectors.selectEntities,
  (stage, race, userEntities): DisplayRace | undefined => {
    if (!stage || !race) {
      return;
    }

    const displayRace = buildDisplayRace(race, userEntities);
    for (let i = 0; i < displayRace.participants.length; i++) {
      if (stage.participantOverrides[displayRace.participants[i].user]) {
        displayRace.participants[i] = {
          ...displayRace.participants[i],
          ...stage.participantOverrides[displayRace.participants[i].user],
        };
      }
    }

    return {
      ...displayRace,
      ...stage.raceOverrides,
    };
  }
);
