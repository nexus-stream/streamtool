import { FC } from "react";
import { DisplayRace } from "../../../../data/display/types";
import { useDisplayRaceValue } from "../../../../data/display/useDisplayRaceValue";
import {
  DefaultValueVisualizer,
  ValueVisualizerProps,
} from "./DefaultValueVisualizer";

interface Props<TParam extends keyof DisplayRace> {
  label: string;
  param: TParam;
  stageId: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayRace[TParam]>>;
}

export function RaceValueViewer<TParam extends keyof DisplayRace>({
  label,
  param,
  stageId,
  ValueVisualizer = DefaultValueVisualizer<DisplayRace[TParam]>,
}: Props<TParam>) {
  const value = useDisplayRaceValue(param, stageId);

  return <ValueVisualizer label={label} value={value} />;
}
