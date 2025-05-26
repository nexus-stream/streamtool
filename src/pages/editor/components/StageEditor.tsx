import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { Stage } from "../../../data/stages/types";
import { useDisplayRaceValue } from "../../../data/display/useDisplayRaceValue";
import { RaceValueEditor } from "./values/RaceValueEditor";
import { ParticipantEditor } from "./ParticipantEditor";
import { RaceValueViewer } from "./values/RaceValueViewer";
import { RaceTimerVisualizer } from "./values/RaceTimerVisualizer";

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
    <div className="grow bg-neutral-800 rounded-md h-full overflow-y-scroll p-4 flex flex-col gap-8">
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
