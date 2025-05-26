import { Typography } from "@mui/material";
import { DisplayParticipant } from "../../../data/display/types";
import { Avatar } from "../../../components/Avatar";
import { useParticipantOverrideState } from "../../../data/display/useParticipantOverrideState";
import { useStageParticipantTimer } from "../../../data/display/displayTimerHooks";

interface Props {
  stageId: string;
  participant: DisplayParticipant;
}

export function ParticipantEditorSummary({ stageId, participant }: Props) {
  const [avatarOverride] = useParticipantOverrideState(
    "avatar",
    stageId,
    participant.user
  );
  const time = useStageParticipantTimer(participant, stageId);

  return (
    <div className="flex align-middle gap-4">
      <Avatar src={avatarOverride ?? participant.avatar} size="small" />
      <Typography component="span" alignContent="center">
        {participant.user}
      </Typography>
      <Typography
        className="text-neutral-400 text-sm"
        component="span"
        alignContent="center"
      >
        ({time})
      </Typography>
    </div>
  );
}
