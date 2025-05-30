import { css, Typography } from "@mui/material";
import { DisplayParticipant } from "../../../data/display/types";
import { Avatar } from "../../../components/Avatar";
import { useParticipantOverrideState } from "../../../data/display/useParticipantOverrideState";
import { useStageParticipantTimer } from "../../../data/display/displayTimerHooks";
import { TitleBar } from "../../../components/Layout";
import { COLORS, spacing } from "../../../style/theme";

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
    <TitleBar>
      <Avatar src={avatarOverride ?? participant.avatar} size="small" />
      <Typography component="span" alignContent="center">
        {participant.user}
      </Typography>
      <Typography css={smallTextStyle} component="span" alignContent="center">
        ({time})
      </Typography>
    </TitleBar>
  );
}

const smallTextStyle = css`
  color: ${COLORS.textDim};
  font-size: ${spacing(3)};
`;
