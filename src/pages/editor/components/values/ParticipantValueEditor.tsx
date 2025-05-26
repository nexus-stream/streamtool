import { FC } from "react";
import { DisplayParticipant } from "../../../../data/display/types";
import { OverrideEditorProps } from "./DefaultOverrideEditor";
import { ValueVisualizerProps } from "./DefaultValueVisualizer";
import { ValueEditor } from "./ValueEditor";
import { useDisplayParticipantValue } from "../../../../data/display/useDisplayParticipantValue";
import { useParticipantOverrideState } from "../../../../data/display/useParticipantOverrideState";

interface Props<TParam extends keyof DisplayParticipant> {
  label: string;
  param: TParam;
  stageId: string;
  user: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayParticipant[TParam]>>;
  OverrideEditor?: FC<OverrideEditorProps<DisplayParticipant[TParam]>>;
}

export function ParticipantValueEditor<
  TParam extends keyof DisplayParticipant
>({
  label,
  param,
  stageId,
  user,
  ValueVisualizer,
  OverrideEditor,
}: Props<TParam>) {
  const value = useDisplayParticipantValue(param, stageId, user);
  const [override, setOverride] = useParticipantOverrideState(
    param,
    stageId,
    user
  );

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
