import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { useHotkeys } from "react-hotkeys-hook";
import { NextStageButton } from "./components/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { PreviousStageButton } from "./components/PreviousStageButton";

export function DockedPage() {
  useHotkeys(
    "ctrl+f",
    () => {
      const origin = import.meta.env.VITE_HTTP_ORIGIN ?? window.location.origin;
      window.open(`${origin}/frame`);
    },
    []
  );

  return (
    // <ObsWebSocketProvider>
    <Page>
      <CenteredStack>
        {/* <ConnectButton /> */}
        <StageSelector />
        <ButtonBar>
          <PreviousStageButton />
          <Button variant="outlined" href="/edit" target="_blank" size="small">
            Edit
          </Button>
          <NextStageButton />
        </ButtonBar>
        <ParticipantOrder />

        {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
        <LiveUpdateManager />
      </CenteredStack>
    </Page>
    // </ObsWebSocketProvider>
  );
}
