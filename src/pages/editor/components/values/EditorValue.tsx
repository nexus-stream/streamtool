import { FC, useCallback, useState } from "react";
import { DefaultValueVisualizer } from "./DefaultValueVisualizer";
import { DefaultOverrideEditor } from "./DefaultOverrideEditor";
import { ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

interface Props<TValue> {
  value: TValue;
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;

  ValueVisualizer?: FC<{ value: TValue }>;
  OverrideEditor?: FC<{
    override: TValue | undefined;
    setOverride: (value: TValue | undefined) => void;
  }>;
}

export function EditorValue<TValue>({
  value,
  override: backingOverride,
  setOverride: setBackingOverride,

  ValueVisualizer = DefaultValueVisualizer<TValue>,
  OverrideEditor = DefaultOverrideEditor<TValue>,
}: Props<TValue>) {
  const [override, setOverride, overrideEnabled, setOverrideEnabled] =
    useLocalValueWithOptionalBacking(backingOverride, setBackingOverride);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div>
      <div className="flex">
        <ValueVisualizer value={value} />
        <ToggleButton
          value="check"
          selected={isEditOpen}
          onChange={() => setIsEditOpen((old) => !old)}
        >
          <EditIcon />
        </ToggleButton>
      </div>
      <div className="flex">
        <OverrideEditor override={override} setOverride={setOverride} />
        <ToggleButton
          value="check"
          selected={overrideEnabled}
          onChange={() => setOverrideEnabled(!overrideEnabled)}
        >
          <CheckIcon />
        </ToggleButton>
      </div>
    </div>
  );
}

function useLocalValueWithOptionalBacking<TValue>(
  value: TValue | undefined,
  setValue: (value: TValue | undefined) => void
): [
  TValue | undefined,
  (newValue: TValue | undefined) => void,
  boolean,
  (newUseBacking: boolean) => void
] {
  const [useBacking, setUseBacking] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const setUseBackingAndUpdate = useCallback(
    (newUseBacking: boolean) => {
      setUseBacking(newUseBacking);
      if (newUseBacking) {
        setValue(localValue);
        setLocalValue(undefined);
      } else {
        setValue(undefined);
        setLocalValue(value);
      }
    },
    [localValue, setValue, value]
  );

  if (useBacking) {
    return [value, setValue, useBacking, setUseBackingAndUpdate];
  } else {
    return [localValue, setLocalValue, useBacking, setUseBackingAndUpdate];
  }
}
