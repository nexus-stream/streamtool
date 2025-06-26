import { TextField } from "@mui/material";
import { useStageParticipantTimer } from "../../../../data/display/timer/displayTimerHooks";
import { DisplayParticipant } from "../../../../data/display/race/types";

export function ParticipantTimerVisualizer({
  stageId,
  participant,
}: {
  stageId: string;
  participant: DisplayParticipant;
}) {
  const time = useStageParticipantTimer(participant, stageId);

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
