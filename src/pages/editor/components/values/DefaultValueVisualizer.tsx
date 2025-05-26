import { Typography } from "@mui/material";

interface Props<TValue> {
  value: TValue;
}

export function DefaultValueVisualizer<TValue>({ value }: Props<TValue>) {
  if (typeof value !== "string") {
    return <p>Default value visualizer only supports strings!</p>;
  }

  return <Typography>{value}</Typography>;
}
