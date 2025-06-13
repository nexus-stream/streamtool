import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { useHotkeys } from "react-hotkeys-hook";
import { ConnectButton } from "./components/ConnectButton";
import { NextStageButton } from "./components/NextStageButton";
import { ParticipantOrder } from "./components/ParticipantOrder";
import { useObsTunnelClient } from "./useObsTunnelClient";

export function DockedPage() {
  useObsTunnelClient();

  useHotkeys(
    "ctrl+f",
    () => {
      window.open("/frame");
    },
    []
  );

  return (
    <Page>
      <CenteredStack>
        <ConnectButton />
        <StageSelector />
        <ButtonBar>
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
  );
}
