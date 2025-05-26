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
import { useSyncableLocalState } from "./useSyncableLocalState";
import classNames from "classnames";

interface Props<TValue> {
  label: string;
  value: TValue;
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;

  ValueVisualizer?: FC<ValueVisualizerProps<TValue>>;
  OverrideEditor?: FC<OverrideEditorProps<TValue>>;
}

export function ValueEditor<TValue>({
  label,
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
    <div className="flex flex-col gap-2">
      <div
        className={classNames("flex gap-4", { "opacity-30": isOverrideSynced })}
      >
        <ValueVisualizer label={label} value={value} />
        <ToggleButton
          size="small"
          value="check"
          selected={isOverrideSynced || isEditOpen}
          onChange={() => setIsEditOpen((old) => isOverrideSynced || !old)}
        >
          <EditIcon />
        </ToggleButton>
      </div>
      {(isOverrideSynced || isEditOpen) && (
        <div
          className={classNames("flex gap-4 pl-8", {
            "opacity-50": !isOverrideSynced,
          })}
        >
          <OverrideEditor
            label={`${label} Override`}
            override={override}
            setOverride={setOverride}
          />
          <ToggleButton
            size="small"
            value="check"
            selected={isOverrideSynced}
            onChange={() => setIsOverrideSynced(!isOverrideSynced)}
          >
            {isOverrideSynced ? "Clear" : "Enable"}
          </ToggleButton>
        </div>
      )}
    </div>
  );
}
