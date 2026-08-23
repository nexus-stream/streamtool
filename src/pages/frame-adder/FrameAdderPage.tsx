import { Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Page, VerticalContent } from "../../components/Layout";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { AddFrameView } from "./components/AddFrameView";
import { EditFrameView } from "./components/EditFrameView";
import { GroupFrameView } from "./components/GroupFrameView";

// The page that generates URLs for the browser sources you can add to OBS with realtime
// data from the stream tool. Most of the crunchy parts of this process live in
// pages/browser-source; this just provides three views: one to add a fresh frame, one to
// edit a frame that's already been selected in OBS, and one to group/ungroup frames.
export function FrameAdderPage() {
  const [mode, setMode] = useState<"add" | "edit" | "group">("add");

  const onChangeMode = (
    _event: SyntheticEvent,
    value: "add" | "edit" | "group"
  ) => {
    setMode(value);
  };

  return (
    <ObsWebSocketProvider>
      <Page>
        <VerticalContent>
          <Tabs value={mode} onChange={onChangeMode}>
            <Tab value="add" label="Add Frame" />
            <Tab value="edit" label="Edit Frame" />
            <Tab value="group" label="Group" />
          </Tabs>
          {mode === "add" ? (
            <AddFrameView />
          ) : mode === "edit" ? (
            <EditFrameView />
          ) : (
            <GroupFrameView />
          )}
        </VerticalContent>
      </Page>
    </ObsWebSocketProvider>
  );
}
