import { TextField } from "@mui/material";
import { useStageRaceTimer } from "../../../../data/display/displayTimerHooks";

export function RaceTimerVisualizer({ stageId }: { stageId: string }) {
  const time = useStageRaceTimer(stageId);

  return (
    <TextField
      fullWidth
      label="Timer"
      value={time}
      size="small"
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
    />
  );
}
