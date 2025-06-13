import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { useHotkeys } from "react-hotkeys-hook";
import { ConnectButton } from "./components/ConnectButton";
import { NextStageButton } from "./components/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { FrameAutoResizer } from "./components/FrameAutoResizer";

export function DockedPage() {
  useHotkeys(
    "ctrl+f",
    () => {
      window.open("/frame");
    },
    []
  );

  return (
    <ObsWebSocketProvider>
      <Page>
        <CenteredStack>
          <ConnectButton />
          <StageSelector />
          <ButtonBar>
            <Button
              variant="outlined"
              href="/edit"
              target="_blank"
              size="small"
            >
              Edit
            </Button>
            <NextStageButton />
          </ButtonBar>
          <ParticipantOrder />

          {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
          <LiveUpdateManager />

          {/* Handles auto resizing the browser source of frames that have opted into that behavior. Should only
          ever be running in one place. */}
          <FrameAutoResizer />
        </CenteredStack>
      </Page>
    </ObsWebSocketProvider>
  );
}
