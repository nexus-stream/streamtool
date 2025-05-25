import { StageList } from "./components/StageList";
import { StageEditor } from "./components/StageEditor";

export function EditorPage() {
  return (
    <div className="flex gap-4 h-full">
      <StageList />
      <StageEditor />
    </div>
  );
}

// Left pane to select stage
// Right pane shows each field in displayrace
// can expand any field to get an override input and activation

// Button + modal to add new stage. Set name and raceId
// Button + modal confirmation to delete a stage. Be sure to clear current id if it's current.

// put these buttons at the bottom of the left panel (+ and -)
