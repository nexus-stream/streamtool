import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { useHotkeys } from "react-hotkeys-hook";
import { NextStageButton } from "./components/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { PreviousStageButton } from "./components/PreviousStageButton";
import { ConnectButton } from "./components/ConnectButton";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { FrameAutoResizer } from "./components/FrameAutoResizer";
import { TwitchButton } from "./components/TwitchButton";
import { ObsDataSync } from "./components/ObsDataSync";
import { AdvancedSceneSwitcherMessageButton } from "./components/AdvancedSceneSwitcherMessageButton";
import { LiveUpdateManager } from "./components/live-update/LiveUpdateManager";

export function DockedPage() {
  useHotkeys(
    "ctrl+f",
    () => {
      window.open(`/frame`);
    },
    []
  );

  useHotkeys(
    "ctrl+t",
    () => {
      window.open(`/flat`);
    },
    []
  );

  return (
    <ObsWebSocketProvider>
      <Page>
        <CenteredStack>
          <ButtonBar>
            <ConnectButton />
            <TwitchButton />
          </ButtonBar>
          <StageSelector />
          <ButtonBar>
            <PreviousStageButton />
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
          <ButtonBar>
            <AdvancedSceneSwitcherMessageButton name="intermission">
              Intermission
            </AdvancedSceneSwitcherMessageButton>
            <AdvancedSceneSwitcherMessageButton name="live">
              Live
            </AdvancedSceneSwitcherMessageButton>
            <AdvancedSceneSwitcherMessageButton name="results">
              Results
            </AdvancedSceneSwitcherMessageButton>
          </ButtonBar>
          <ParticipantOrder />

          {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
          <LiveUpdateManager />

          {/* Handles auto resizing the browser source of frames that have opted into that behavior. Should only
          ever be running in one place. */}
          <FrameAutoResizer />

          {/* Handles syncing current stage data to advanced scene switcher. Should only ever be running
          in one place. */}
          <ObsDataSync />
        </CenteredStack>
      </Page>
    </ObsWebSocketProvider>
  );
}
