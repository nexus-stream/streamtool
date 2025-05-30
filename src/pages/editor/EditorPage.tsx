import { StageList } from "./components/StageList";
import { StageEditor } from "./components/StageEditor";
import { HorizontalContent, Page } from "../../components/Layout";

export function EditorPage() {
  return (
    <Page>
      <HorizontalContent>
        <StageList />
        <StageEditor />
      </HorizontalContent>
    </Page>
  );
}
