import { TextField } from "@mui/material";
import { useCallback } from "react";

export interface OverrideEditorProps<TValue> {
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;
}

export function DefaultOverrideEditor<TValue>({
  override,
  setOverride,
}: OverrideEditorProps<TValue>) {
  const setTypedOverride = useCallback(
    (value: string) => {
      const typedValue = (value || undefined) as TValue | undefined;
      setOverride(typedValue);
    },
    [setOverride]
  );

  if (override && typeof override !== "string") {
    return <p>Default override editor only supports strings!</p>;
  }

  return (
    <TextField
      className="w-md"
      value={override ?? ""}
      size="small"
      label="Override"
      onChange={(event) => setTypedOverride(event.target.value)}
    />
  );
}
