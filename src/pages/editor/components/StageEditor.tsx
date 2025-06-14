import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { Stage } from "../../../data/stages/types";
import { useDisplayRaceValue } from "../../../data/display/useDisplayRaceValue";
import { RaceValueEditor } from "./values/RaceValueEditor";
import { ParticipantEditor } from "./ParticipantEditor";
import { RaceValueViewer } from "./values/RaceValueViewer";
import { RaceTimerVisualizer } from "./values/RaceTimerVisualizer";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { COLORS } from "../../../style/theme";

export function StageEditor() {
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  if (!currentEditorStage) {
    return <EmptyStageEditor />;
  }

  return <StageEditorContent stage={currentEditorStage} />;
}

export function StageEditorContent({ stage }: { stage: Stage }) {
  const participants = useDisplayRaceValue("participants", stage.id);

  return (
    <div css={containerStyle}>
      <RaceValueViewer label="Race ID" param="raceId" stageId={stage.id} />
      <RaceValueEditor label="Game" param="game" stageId={stage.id} />
      <RaceValueEditor label="Category" param="category" stageId={stage.id} />
      <RaceValueViewer label="Race Status" param="status" stageId={stage.id} />
      <RaceTimerVisualizer stageId={stage.id} />
      <div>
        {participants.map((participant) => (
          <ParticipantEditor
            key={participant.user}
            stageId={stage.id}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyStageEditor() {
  return null;
}

const containerStyle = css`
  ${STYLES.spacedFlex};
  ${STYLES.roundedCorners};
  ${STYLES.fullHeight};
  ${STYLES.padded};
  flex-direction: column;
  flex-grow: 1;
  background-color: ${COLORS.bgLight};
  overflow-y: scroll;
`;
