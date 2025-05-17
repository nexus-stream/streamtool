import { useSelector } from "react-redux";
import { DisplayRace, RaceOverrides } from "./types";
import { stageSelectors } from "./selectors";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { useMemo } from "react";
import { buildDisplayRace } from "./displayRaceBuilder";

export function useDisplayRace(stageId: string): DisplayRace {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  const race = useSelector(raceSelectors.selectEntities)[stage.raceId];
  const users = useSelector(userSelectors.selectEntities);

  return useMemo(
    () => buildDisplayRace(race, stage.overrides, users),
    [race, stage.overrides, users]
  );
}

export function useDisplayRaceWithoutOverrides(stageId: string): DisplayRace {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  const race = useSelector(raceSelectors.selectEntities)[stage.raceId];
  const users = useSelector(userSelectors.selectEntities);

  return useMemo(
    () => buildDisplayRace(race, { participantOverrides: {} }, users),
    [race, users]
  );
}

export function useStageOverrides(stageId: string): RaceOverrides {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  return stage.overrides;
}
