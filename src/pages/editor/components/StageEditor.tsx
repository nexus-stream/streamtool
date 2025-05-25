import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { useDisplayRaceWithoutOverrides } from "../../../data/stages/hooks";
import { Stage } from "../../../data/stages/types";

export function StageEditor() {
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  if (!currentEditorStage) {
    return <EmptyStageEditor />;
  }

  return <StageEditorContent stage={currentEditorStage} />;
}

export function StageEditorContent({ stage }: { stage: Stage }) {
  const displayRace = useDisplayRaceWithoutOverrides(stage.id);

  return (
    <div className="grow bg-neutral-900 rounded-md h-full overflow-y-scroll">
      <p>{JSON.stringify(displayRace)?.split(",").join(", ")}</p>
      <p>{JSON.stringify(stage.overrides)?.split(",").join(", ")}</p>
    </div>
  );
}

export function EmptyStageEditor() {
  return null;
}
