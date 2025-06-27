import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { NextStageButton } from "./components/buttons/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { AdminContainer } from "./components/AdminContainer";
import { AdvancedSceneSwitcherMessageButton } from "./components/buttons/AdvancedSceneSwitcherMessageButton";
import { OBSConnectButton } from "./components/buttons/OBSConnectButton";
import { PreviousStageButton } from "./components/buttons/PreviousStageButton";
import { TwitchButton } from "./components/buttons/TwitchButton";
import { DockedPageSyncManager } from "./components/sync/DockedPageSyncManager";
import { BuildTime } from "./components/BuildTime";
import { ViewDebugDataButton } from "./components/buttons/ViewDebugDataButton";
import { AddFramesButton } from "./components/buttons/AddFramesButton";
import { useDockedPageHotkeys } from "./hooks/useDockedPageHotkeys";

// The page that lives in the custom dock on OBS. Because this page always exists when
// the tool is in use and there's only ever one of them, it handles a lot of behind the
// scenes integration stuff with OBS and Twitch as well as rendering the main set of
// controls a host will use.
export function DockedPage() {
  useDockedPageHotkeys();

  return (
    <ObsWebSocketProvider>
      <Page>
        <CenteredStack>
          <AdminContainer>
            <BuildTime />
            <ButtonBar>
              <OBSConnectButton />
              <TwitchButton />
              <AddFramesButton />
              <ViewDebugDataButton />
            </ButtonBar>
          </AdminContainer>
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

          <DockedPageSyncManager />
        </CenteredStack>
      </Page>
    </ObsWebSocketProvider>
  );
}
