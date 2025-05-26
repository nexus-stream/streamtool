import { Typography } from "@mui/material";

export interface ValueVisualizerProps<TValue> {
  value: TValue;
}

export function DefaultValueVisualizer<TValue>({
  value,
}: ValueVisualizerProps<TValue>) {
  if (typeof value !== "string") {
    return <p>Default value visualizer only supports strings!</p>;
  }

  return <Typography>{value}</Typography>;
}
