import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

interface Props {
  name: string;
  options: string[];
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
}

export function EnumParamControl({ name, options, params, setParams }: Props) {
  const onChange = useCallback(
    (event: SelectChangeEvent) => {
      setParams((old) => {
        return { ...old, [name]: event.target.value };
      });
    },
    [name, setParams]
  );

  const value = (params as { [key: string]: unknown })[name] as string;

  return (
    <FormControl>
      <InputLabel>{name}</InputLabel>
      <Select value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
