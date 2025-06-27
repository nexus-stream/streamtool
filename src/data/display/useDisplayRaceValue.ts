import { useSelector } from "react-redux";
import { stageSelectors } from "../stages/selectors";
import { useAppSelector } from "../hooks";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DISPLAY_RACE_FIELDS } from "./race/displayRaceFields";
import { RaceStage } from "../stages/types";
import { DisplayRace } from "./race/types";

export function useDisplayRaceValue<TParam extends keyof DisplayRace>(
  param: TParam,
  stageId: string
): DisplayRace[TParam] {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  const race = useAppSelector(raceSelectors.selectEntities)[
    (stage as RaceStage).raceId
  ];
  const users = useAppSelector(userSelectors.selectEntities);

  return DISPLAY_RACE_FIELDS[param](race, users);
}
