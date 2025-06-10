import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { useHotkeys } from "react-hotkeys-hook";
import { ConnectButton } from "./components/ConnectButton";

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
          <StageSelector />
          <ButtonBar>
            <ConnectButton />
            <Button
              variant="outlined"
              href="/edit"
              target="_blank"
              size="small"
            >
              Edit
            </Button>
          </ButtonBar>

          {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
          <LiveUpdateManager />
        </CenteredStack>
      </Page>
    </ObsWebSocketProvider>
  );
}
