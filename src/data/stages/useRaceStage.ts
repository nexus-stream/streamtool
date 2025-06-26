import { useSelector } from "react-redux";
import { stageSelectors } from "./selectors";
import { RaceStage } from "./types";

export function useRaceStage(stageId: string): RaceStage | undefined {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  if (stage?.kind !== "race") {
    return undefined;
  }

  return stage;
}
