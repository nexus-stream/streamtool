import { css, Typography } from "@mui/material";
import { Avatar } from "../../../components/Avatar";
import { useParticipantOverrideState } from "../../../data/display/useParticipantOverrideState";
import { useStageParticipantTimer } from "../../../data/display/timer/displayTimerHooks";
import { TitleBar } from "../../../components/Layout";
import { COLORS, size } from "../../../style/theme";
import { DisplayParticipant } from "../../../data/display/participant/types";

interface Props {
  stageId: string;
  participant: DisplayParticipant;
}

// The component that shows in the accordion for a single participant on the edit page
// when it's collapsed.
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
  font-size: ${size(3)};
`;
