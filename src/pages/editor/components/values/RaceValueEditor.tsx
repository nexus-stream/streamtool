import { FC } from "react";
import { useDisplayRaceValue } from "../../../../data/display/useDisplayRaceValue";
import { useRaceOverrideState } from "../../../../data/display/useRaceOverrideState";
import { OverrideEditorProps } from "./DefaultOverrideEditor";
import { ValueVisualizerProps } from "./DefaultValueVisualizer";
import { ValueEditor } from "./ValueEditor";
import { DisplayRace } from "../../../../data/display/race/types";

interface Props<TParam extends keyof DisplayRace> {
  label: string;
  param: TParam;
  stageId: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayRace[TParam]>>;
  OverrideEditor?: FC<OverrideEditorProps<DisplayRace[TParam]>>;
}

export function RaceValueEditor<TParam extends keyof DisplayRace>({
  label,
  param,
  stageId,
  ValueVisualizer,
  OverrideEditor,
}: Props<TParam>) {
  const value = useDisplayRaceValue(param, stageId);
  const [override, setOverride] = useRaceOverrideState(param, stageId);

  return (
    <ValueEditor
      label={label}
      value={value}
      override={override}
      setOverride={setOverride}
      ValueVisualizer={ValueVisualizer}
      OverrideEditor={OverrideEditor}
    />
  );
}
