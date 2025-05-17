import { createSelector } from "@reduxjs/toolkit";
import { stageSelectors } from "../stages/selectors";
import { RaceLiveUpdater } from "./RaceLiveUpdater";
import { useAppSelector } from "../hooks";

// Builds a live updater for every race that we want to actively pull updates for
// (all races that belong to a stage). This lets us leverage React's lifecycle
// events to setup and teardown our websocket connections.
//
// This could also be a good place to clean up unattached races / users from as
// well.
export function LiveUpdateManager() {
  const raceIds = useAppSelector(selectActiveRaceIds);

  return (
    <>
      {raceIds.map((raceId) => (
        <RaceLiveUpdater key={raceId} raceId={raceId} />
      ))}
    </>
  );
}

const selectActiveRaceIds = createSelector(
  stageSelectors.selectAll,
  (stages) => {
    const allRaces = stages.map((stage) => stage.raceId);
    return Array.from(new Set(allRaces));
  }
);
