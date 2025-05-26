import { TextField } from "@mui/material";

export interface ValueVisualizerProps<TValue> {
  label: string;
  value: TValue;
}

export function DefaultValueVisualizer<TValue>({
  label,
  value,
}: ValueVisualizerProps<TValue>) {
  if (value && typeof value !== "string") {
    return <p>Default value visualizer only supports strings!</p>;
  }

  return (
    <TextField
      fullWidth
      label={label}
      value={value ?? "*empty*"}
      size="small"
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
    />
  );
}
