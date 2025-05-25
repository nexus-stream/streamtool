import { TextField } from "@mui/material";
import { ChangeEvent, useCallback } from "react";

interface Props {
  name: string;
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
}

export function StringParamControl({ name, params, setParams }: Props) {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setParams((old) => {
        return { ...old, [name]: event.target.value };
      });
    },
    [name, setParams]
  );

  const value = (params as { [key: string]: unknown })[name];

  return <TextField label={name} value={value} onChange={onChange} />;
}
