import { useSelector } from "react-redux";
import {
  selectCurrentStageId,
  stageSelectors,
} from "../../../data/stages/selectors";
import { useCallback } from "react";
import { useAppDispatch } from "../../../data/hooks";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { setCurrentStageId } from "../../../data/stages/stageSlice";

export function StageSelector() {
  const currentStageId = useSelector(selectCurrentStageId);
  const stages = useSelector(stageSelectors.selectAll);
  const dispatch = useAppDispatch();

  const onChange = useCallback(
    (event: SelectChangeEvent) => {
      const newStageId = event.target.value || undefined;
      dispatch(setCurrentStageId(newStageId));
    },
    [dispatch]
  );

  return (
    <FormControl fullWidth>
      <InputLabel id="current-stage-select-label">Current Stage</InputLabel>
      <Select
        labelId="current-stage-select-label"
        id="current-stage-select"
        value={currentStageId ?? ""}
        label="Current Stage"
        onChange={onChange}
      >
        <MenuItem value={""}>None</MenuItem>
        {stages.map((stage) => (
          <MenuItem key={stage.id} value={stage.id}>
            {stage.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
