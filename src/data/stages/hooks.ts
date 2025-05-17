import { DisplayRace, RaceOverrides } from "./types";
import { stageSelectors } from "./selectors";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { useMemo } from "react";
import { buildDisplayRace } from "./displayRaceBuilder";
import { useAppSelector } from "../hooks";

export function useDisplayRace(stageId: string): DisplayRace {
  const stage = useAppSelector(stageSelectors.selectEntities)[stageId];
  const race = useAppSelector(raceSelectors.selectEntities)[stage.raceId];
  const users = useAppSelector(userSelectors.selectEntities);

  return useMemo(
    () => buildDisplayRace(race, stage.overrides, users),
    [race, stage.overrides, users]
  );
}

export function useDisplayRaceWithoutOverrides(stageId: string): DisplayRace {
  const stage = useAppSelector(stageSelectors.selectEntities)[stageId];
  const race = useAppSelector(raceSelectors.selectEntities)[stage.raceId];
  const users = useAppSelector(userSelectors.selectEntities);

  return useMemo(
    () => buildDisplayRace(race, { participantOverrides: {} }, users),
    [race, users]
  );
}

export function useStageOverrides(stageId: string): RaceOverrides {
  const stage = useAppSelector(stageSelectors.selectEntities)[stageId];
  return stage.overrides;
}
