import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { DisplayParticipant } from "../../../data/display/types";
import { ParticipantValueEditor } from "./values/ParticipantValueEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ParticipantValueViewer } from "./values/ParticipantValueViewer";

interface Props {
  stageId: string;
  participant: DisplayParticipant;
}

export function ParticipantEditor({ stageId, participant }: Props) {
  return (
    <Accordion key={participant.user}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">{participant.user}</Typography>
      </AccordionSummary>
      <AccordionDetails className="flex flex-col gap-8">
        <ParticipantValueEditor
          label="Twitch Username"
          param="twitchUser"
          stageId={stageId}
          user={participant.user}
        />
        <ParticipantValueEditor
          label="Display Name"
          param="displayName"
          stageId={stageId}
          user={participant.user}
        />
        <ParticipantValueEditor
          label="Pronouns"
          param="pronouns"
          stageId={stageId}
          user={participant.user}
        />
        <ParticipantValueEditor
          label="Avatar"
          param="avatar"
          stageId={stageId}
          user={participant.user}
        />
        <ParticipantValueViewer
          label="Runner Status"
          param="status"
          stageId={stageId}
          user={participant.user}
        />
        <ParticipantValueViewer
          label="Final Time"
          param="finalTime"
          stageId={stageId}
          user={participant.user}
        />
      </AccordionDetails>
    </Accordion>
  );
}
