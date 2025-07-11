import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { Stage, VodStage } from "../../../data/stages/types";
import { useDisplayRaceValue } from "../../../data/display/useDisplayRaceValue";
import { RaceValueEditor } from "./values/RaceValueEditor";
import { ParticipantEditor } from "./ParticipantEditor";
import { RaceValueViewer } from "./values/RaceValueViewer";
import { RaceTimerVisualizer } from "./values/RaceTimerVisualizer";
import { css } from "@emotion/react";
import { STYLES } from "../../../style/styles";
import { COLORS, size } from "../../../style/theme";
import { StageValueEditor } from "./values/StageValueEditor";
import { useRaceOverrideState } from "../../../data/display/useRaceOverrideState";
import { CommentatorEditor } from "./CommentatorEditor";
import { Button } from "@mui/material";
import { StageGameNameEditor } from "./values/StageGameNameEditor";
import { StageTagEditor } from "./values/StageTagEditor";

// The editor for a stage. For simple string values, you should only need to add a
// StageValueEditor or RaceValueEditor component for the new field and those helpers
// will take care of the rest.
export function StageEditor() {
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  if (!currentEditorStage) {
    return <EmptyStageEditor />;
  }

  return <StageEditorContent stage={currentEditorStage} />;
}

export function StageEditorContent({ stage }: { stage: Stage }) {
  return (
    <div css={containerStyle}>
      <h2>Stage Data</h2>
      <StageValueEditor label="Internal Name" param="name" stageId={stage.id} />
      <StageValueEditor
        label="Stream Title"
        param="streamTitle"
        stageId={stage.id}
      />
      <StageGameNameEditor stageId={stage.id} />
      <StageTagEditor key={stage.id} stageId={stage.id} />
      {stage.kind === "race" && <StageRaceEditor stage={stage} />}
      {stage.kind === "vod" && <StageVodEditor stage={stage} />}
    </div>
  );
}

function StageRaceEditor({ stage }: { stage: Stage }) {
  const participants = useDisplayRaceValue("participants", stage.id);
  const [commentators, setCommentators] = useRaceOverrideState(
    "commentators",
    stage.id
  );

  return (
    <>
      <h2>Race Data</h2>
      <RaceValueViewer label="Race ID" param="raceId" stageId={stage.id} />
      <RaceValueEditor label="Game" param="game" stageId={stage.id} />
      <RaceValueEditor label="Category" param="category" stageId={stage.id} />
      <RaceValueViewer label="Race Status" param="status" stageId={stage.id} />
      <RaceTimerVisualizer stageId={stage.id} />
      <div>
        <h3>Participants</h3>
        {participants.map((participant) => (
          <ParticipantEditor
            key={participant.user}
            stageId={stage.id}
            participant={participant}
          />
        ))}
      </div>
      <div>
        <h3>Commentators</h3>
        {commentators?.map((commentator, index) => (
          <CommentatorEditor
            key={index}
            commentator={commentator}
            onEdit={(newValue) => {
              const newCommentators = [...commentators];
              newCommentators[index] = newValue;
              setCommentators(newCommentators);
            }}
            onDelete={() => {
              const newCommentators = [...commentators];
              newCommentators.splice(index, 1);
              setCommentators(newCommentators);
            }}
          />
        ))}
        <Button
          css={addButtonStyle}
          variant="outlined"
          size="small"
          onClick={() => {
            setCommentators([...(commentators ?? []), { user: "" }]);
          }}
        >
          Add
        </Button>
      </div>
    </>
  );
}

function StageVodEditor({ stage }: { stage: Stage }) {
  return (
    <>
      <h2>Vod Data</h2>
      <StageValueEditor<"vodId", VodStage>
        label="Vod ID"
        param="vodId"
        stageId={stage.id}
      />
    </>
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
  padding-bottom: ${size(64)};
`;

const addButtonStyle = css`
  margin-top: ${size(4)};
`;
