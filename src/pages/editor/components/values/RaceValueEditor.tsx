import { FC } from "react";
import { DisplayRace } from "../../../../data/display/types";
import { useDisplayRaceValue } from "../../../../data/display/useDisplayRaceValue";
import { useRaceOverrideState } from "../../../../data/display/useRaceOverrideState";
import { OverrideEditorProps } from "./DefaultOverrideEditor";
import { ValueVisualizerProps } from "./DefaultValueVisualizer";
import { ValueEditor } from "./ValueEditor";

interface Props<TKey extends keyof DisplayRace> {
  param: TKey;
  stageId: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayRace[TKey]>>;
  OverrideEditor?: FC<OverrideEditorProps<DisplayRace[TKey]>>;
}

export function RaceValueEditor<TKey extends keyof DisplayRace>({
  param,
  stageId,
  ValueVisualizer,
  OverrideEditor,
}: Props<TKey>) {
  const value = useDisplayRaceValue(param, stageId);
  const [override, setOverride] = useRaceOverrideState(param, stageId);

  return (
    <ValueEditor
      value={value}
      override={override}
      setOverride={setOverride}
      ValueVisualizer={ValueVisualizer}
      OverrideEditor={OverrideEditor}
    />
  );
}
