import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ParticipantValueEditor } from "./values/ParticipantValueEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ParticipantValueViewer } from "./values/ParticipantValueViewer";
import { ParticipantTimerVisualizer } from "./values/ParticipantTimerVisualizer";
import { ParticipantEditorSummary } from "./ParticipantEditorSummary";
import { VerticalContent } from "../../../components/Layout";
import { DisplayParticipant } from "../../../data/display/participant/types";

interface Props {
  stageId: string;
  participant: DisplayParticipant;
}

// The editor for a single participant. If you're adding a new field here that's just
// a simple string, you should only need to add a "ParticipantValueEditor" component
// for the new field and it'll handle the rest.
export function ParticipantEditor({ stageId, participant }: Props) {
  return (
    <Accordion key={participant.user}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ParticipantEditorSummary participant={participant} stageId={stageId} />
      </AccordionSummary>
      <AccordionDetails>
        <VerticalContent>
          <ParticipantValueViewer
            label="Runner Status"
            param="status"
            stageId={stageId}
            user={participant.user}
          />
          <ParticipantTimerVisualizer
            participant={participant}
            stageId={stageId}
          />
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
          <ParticipantValueEditor
            label="Personal Best"
            param="pb"
            stageId={stageId}
            user={participant.user}
          />
        </VerticalContent>
      </AccordionDetails>
    </Accordion>
  );
}
