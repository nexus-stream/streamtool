import { DisplayRace } from "../../../../data/display/types";
import { useDisplayRaceValue } from "../../../../data/display/useDisplayRaceValue";
import { useRaceOverrideState } from "../../../../data/display/useRaceOverrideState";
import { EditorValue } from "./EditorValue";

interface Props<TKey extends keyof DisplayRace> {
  param: TKey;
  stageId: string;
}

export function RaceValueEditor<TKey extends keyof DisplayRace>({
  param,
  stageId,
}: Props<TKey>) {
  const value = useDisplayRaceValue(param, stageId);
  const [override, setOverride] = useRaceOverrideState(param, stageId);

  return (
    <EditorValue value={value} override={override} setOverride={setOverride} />
  );
}
