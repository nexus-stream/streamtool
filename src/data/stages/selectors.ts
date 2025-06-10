import { createSelector } from "@reduxjs/toolkit";
import { stageAdapter, stageRootSelector } from "./stageSlice";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DisplayParticipant, DisplayRace } from "../display/types";
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

export const selectNextStage = createSelector(
  stageSelectors.selectIds,
  stageSelectors.selectAll,
  selectCurrentStageId,
  (stageIds, stages, stageId) => {
    if (!stageId) {
      return undefined;
    }

    const currentStageIndex = stageIds.indexOf(stageId);
    if (currentStageIndex === -1) {
      return undefined;
    }

    return stages[currentStageIndex + 1];
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
    displayRace.participants = orderParticipants(
      displayRace.participants,
      stage.participantOrder ?? []
    );
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

function orderParticipants(
  participants: DisplayParticipant[],
  stageOrder: string[]
) {
  const participantMap = participants.reduce((map, participant) => {
    map[participant.user] = participant;
    return map;
  }, {} as { [user: string]: DisplayParticipant });

  const orderedParticipants: DisplayParticipant[] = [];

  for (const user of stageOrder) {
    const participant = participantMap[user];
    if (participant) {
      orderedParticipants.push(participant);
      delete participantMap[user];
    }
  }

  for (const participant of participants) {
    if (participantMap[participant.user]) {
      orderedParticipants.push(participant);
    }
  }

  return orderedParticipants;
}
