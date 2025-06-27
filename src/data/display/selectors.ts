import { createSelector } from "@reduxjs/toolkit";
import { raceSelectors } from "../races/selectors";
import { selectCurrentStage } from "../stages/selectors";
import { userSelectors } from "../users/selectors";
import { DisplayRace } from "./race/types";
import { buildDisplayRace } from "./race/buildDisplayRace";
import { DisplayParticipant } from "./participant/types";
import { flattenObj } from "../../util/flattenObj";

const selectCurrentRace = createSelector(
  selectCurrentStage,
  raceSelectors.selectEntities,
  (stage, raceEntities) => {
    if (!stage || stage.kind !== "race") {
      return undefined;
    }

    return raceEntities[stage.raceId];
  }
);

export const selectCurrentDisplayRace = createSelector(
  selectCurrentStage,
  selectCurrentRace,
  userSelectors.selectEntities,
  (stage, race, userEntities): DisplayRace | undefined => {
    if (!stage || !race || stage.kind !== "race") {
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

export const selectCurrentRaceResults = createSelector(
  selectCurrentDisplayRace,
  (race) => {
    if (!race) {
      return [];
    }

    return [...race.participants].sort((a, b) => {
      const aFinished = a.status === "finished" || a.status === "confirmed";
      const bFinished = b.status === "finished" || b.status === "confirmed";

      if (aFinished && !bFinished) {
        return -1;
      }

      if (!aFinished && bFinished) {
        return 1;
      }

      if (a.finalTime && !b.finalTime) {
        return -1;
      }

      if (!a.finalTime && b.finalTime) {
        return 1;
      }

      if (a.finalTime && b.finalTime) {
        return a.finalTime - b.finalTime;
      }

      return 0;
    });
  }
);

export const selectCurrentFlattenedDisplayData = createSelector(
  selectCurrentStage,
  selectCurrentDisplayRace,
  selectCurrentRaceResults,
  (stage, race, results) => flattenObj({ stage, race, results })
);
