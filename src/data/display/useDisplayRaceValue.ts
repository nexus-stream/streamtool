import { useSelector } from "react-redux";
import { stageSelectors } from "../stages/selectors";
import { DisplayRace } from "./types";
import { useAppSelector } from "../hooks";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DISPLAY_RACE_FIELDS } from "./displayRaceFields";

export function useDisplayRaceValue<TKey extends keyof DisplayRace>(
  key: TKey,
  stageId: string
): DisplayRace[TKey] {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  const race = useAppSelector(raceSelectors.selectEntities)[stage.raceId];
  const users = useAppSelector(userSelectors.selectEntities);

  return DISPLAY_RACE_FIELDS[key](race, users);
}
