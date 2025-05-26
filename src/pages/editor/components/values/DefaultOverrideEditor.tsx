import { TextField } from "@mui/material";

interface Props<TValue> {
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;
}

export function DefaultOverrideEditor<TValue>({
  override,
  setOverride,
}: Props<TValue>) {
  if (override && typeof override !== "string") {
    return <p>Default override editor only supports strings!</p>;
  }

  return (
    <TextField
      value={override}
      onChange={(event) => setOverride(event.target.value as TValue)}
    />
  );
}
