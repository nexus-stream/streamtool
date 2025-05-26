import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { Stage } from "../../../data/stages/types";
import { useDisplayRaceValue } from "../../../data/display/useDisplayRaceValue";

export function StageEditor() {
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  if (!currentEditorStage) {
    return <EmptyStageEditor />;
  }

  return <StageEditorContent stage={currentEditorStage} />;
}

export function StageEditorContent({ stage }: { stage: Stage }) {
  const game = useDisplayRaceValue("game", stage.id);
  const participants = useDisplayRaceValue("participants", stage.id);

  return (
    <div className="grow bg-neutral-900 rounded-md h-full overflow-y-scroll p-4">
      <p>{JSON.stringify(game)?.split(",").join(", ")}</p>
      <p>{JSON.stringify(participants)?.split(",").join(", ")}</p>
      <p>{JSON.stringify(stage.raceOverrides)?.split(",").join(", ")}</p>
    </div>
  );
}

export function EmptyStageEditor() {
  return null;
}
