import { FC } from "react";
import {
  DefaultValueVisualizer,
  ValueVisualizerProps,
} from "./DefaultValueVisualizer";
import { useDisplayParticipantValue } from "../../../../data/display/useDisplayParticipantValue";
import { DisplayParticipant } from "../../../../data/display/race/types";

interface Props<TParam extends keyof DisplayParticipant> {
  label: string;
  param: TParam;
  stageId: string;
  user: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayParticipant[TParam]>>;
}

export function ParticipantValueViewer<
  TParam extends keyof DisplayParticipant
>({
  label,
  param,
  stageId,
  user,
  ValueVisualizer = DefaultValueVisualizer<DisplayParticipant[TParam]>,
}: Props<TParam>) {
  const value = useDisplayParticipantValue(param, stageId, user);

  return <ValueVisualizer label={label} value={value} />;
}
