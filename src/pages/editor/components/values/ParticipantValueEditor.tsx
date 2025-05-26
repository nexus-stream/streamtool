import { FC } from "react";
import { DisplayParticipant } from "../../../../data/display/types";
import { OverrideEditorProps } from "./DefaultOverrideEditor";
import { ValueVisualizerProps } from "./DefaultValueVisualizer";
import { ValueEditor } from "./ValueEditor";
import { useDisplayParticipantValue } from "../../../../data/display/useDisplayParticipantValue";
import { useParticipantOverrideState } from "../../../../data/display/useParticipantOverrideState";

interface Props<TKey extends keyof DisplayParticipant> {
  param: TKey;
  stageId: string;
  user: string;

  ValueVisualizer?: FC<ValueVisualizerProps<DisplayParticipant[TKey]>>;
  OverrideEditor?: FC<OverrideEditorProps<DisplayParticipant[TKey]>>;
}

export function ParticipantValueEditor<TKey extends keyof DisplayParticipant>({
  param,
  stageId,
  user,
  ValueVisualizer,
  OverrideEditor,
}: Props<TKey>) {
  const value = useDisplayParticipantValue(param, stageId, user);
  const [override, setOverride] = useParticipantOverrideState(
    param,
    stageId,
    user
  );

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
