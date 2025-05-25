import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";

export function StageEditor() {
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  return (
    <div className="grow">
      <p>{JSON.stringify(currentEditorStage)?.split(",").join(", ")}</p>
    </div>
  );
}
