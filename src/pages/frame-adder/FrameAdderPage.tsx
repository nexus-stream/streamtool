import { Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Page, VerticalContent } from "../../components/Layout";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { AddFrameView } from "./components/AddFrameView";
import { EditFrameView } from "./components/EditFrameView";

// The page that generates URLs for the browser sources you can add to OBS with realtime
// data from the stream tool. Most of the crunchy parts of this process live in
// pages/browser-source; this just provides two views: one to add a fresh frame and one
// to edit a frame that's already been selected in OBS.
export function FrameAdderPage() {
  const [mode, setMode] = useState<"add" | "edit">("add");

  const onChangeMode = (_event: SyntheticEvent, value: "add" | "edit") => {
    setMode(value);
  };

  return (
    <ObsWebSocketProvider>
      <Page>
        <VerticalContent>
          <Tabs value={mode} onChange={onChangeMode}>
            <Tab value="add" label="Add Frame" />
            <Tab value="edit" label="Edit Frame" />
          </Tabs>
          {mode === "add" ? <AddFrameView /> : <EditFrameView />}
        </VerticalContent>
      </Page>
    </ObsWebSocketProvider>
  );
}
