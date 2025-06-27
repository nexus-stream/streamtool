import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { useHotkeys } from "react-hotkeys-hook";
import { NextStageButton } from "./components/buttons/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { toggleIsAdmin } from "../../data/config/configSlice";
import { useAppDispatch } from "../../data/hooks";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { AdminContainer } from "./components/AdminContainer";
import { AdvancedSceneSwitcherMessageButton } from "./components/buttons/AdvancedSceneSwitcherMessageButton";
import { ConnectButton } from "./components/buttons/ConnectButton";
import { PreviousStageButton } from "./components/buttons/PreviousStageButton";
import { TwitchButton } from "./components/buttons/TwitchButton";
import { DockedPageSyncManager } from "./components/sync/DockedPageSyncManager";
import { BuildTime } from "./components/BuildTime";
import { ViewDebugDataButton } from "./components/buttons/ViewDebugDataButton";
import { AddFramesButton } from "./components/buttons/AddFramesButton";

export function DockedPage() {
  const dispatch = useAppDispatch();

  useHotkeys(
    "ctrl+f",
    () => {
      window.open(`/frame`);
    },
    []
  );

  useHotkeys(
    "ctrl+d",
    () => {
      window.open(`/debug`);
    },
    []
  );

  useHotkeys(
    "ctrl+a",
    () => {
      dispatch(toggleIsAdmin());
    },
    [dispatch]
  );

  return (
    <ObsWebSocketProvider>
      <Page>
        <CenteredStack>
          <AdminContainer>
            <BuildTime />
            <ButtonBar>
              <ConnectButton />
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
