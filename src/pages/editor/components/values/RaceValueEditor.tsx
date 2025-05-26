import { FC } from "react";
import { DisplayRace } from "../../../../data/display/types";
import { useDisplayRaceValue } from "../../../../data/display/useDisplayRaceValue";
import { useRaceOverrideState } from "../../../../data/display/useRaceOverrideState";
import { OverrideEditorProps } from "./DefaultOverrideEditor";
import { ValueVisualizerProps } from "./DefaultValueVisualizer";
import { ValueEditor } from "./ValueEditor";

interface Props<TParam extends keyof DisplayRace> {
  param: TParam;
  stageId: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayRace[TParam]>>;
  OverrideEditor?: FC<OverrideEditorProps<DisplayRace[TParam]>>;
}

export function RaceValueEditor<TParam extends keyof DisplayRace>({
  param,
  stageId,
  ValueVisualizer,
  OverrideEditor,
}: Props<TParam>) {
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
