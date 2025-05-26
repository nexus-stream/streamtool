import { FC, useState } from "react";
import {
  DefaultValueVisualizer,
  ValueVisualizerProps,
} from "./DefaultValueVisualizer";
import {
  DefaultOverrideEditor,
  OverrideEditorProps,
} from "./DefaultOverrideEditor";
import { ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useSyncableLocalState } from "./useSyncableLocalState";

interface Props<TValue> {
  value: TValue;
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;

  ValueVisualizer?: FC<ValueVisualizerProps<TValue>>;
  OverrideEditor?: FC<OverrideEditorProps<TValue>>;
}

export function ValueEditor<TValue>({
  value,
  override: backingOverride,
  setOverride: setBackingOverride,

  ValueVisualizer = DefaultValueVisualizer<TValue>,
  OverrideEditor = DefaultOverrideEditor<TValue>,
}: Props<TValue>) {
  const [override, setOverride, isOverrideSynced, setIsOverrideSynced] =
    useSyncableLocalState(backingOverride, setBackingOverride);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div>
      <div className="flex">
        <ValueVisualizer value={value} />
        <ToggleButton
          value="check"
          selected={isOverrideSynced || isEditOpen}
          onChange={() => setIsEditOpen((old) => isOverrideSynced || !old)}
        >
          <EditIcon />
        </ToggleButton>
      </div>
      {(isOverrideSynced || isEditOpen) && (
        <div className="flex">
          <OverrideEditor override={override} setOverride={setOverride} />
          <ToggleButton
            value="check"
            selected={isOverrideSynced}
            onChange={() => setIsOverrideSynced(!isOverrideSynced)}
          >
            <CheckIcon />
          </ToggleButton>
        </div>
      )}
    </div>
  );
}
