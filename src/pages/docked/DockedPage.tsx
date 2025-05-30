import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";

export function DockedPage() {
  return (
    <Page>
      <CenteredStack>
        <StageSelector />
        <ButtonBar>
          <Button variant="outlined" href="/edit" target="_blank" size="small">
            Edit Stages
          </Button>
          <Button
            variant="outlined"
            href={getFrameHref()}
            target="_blank"
            size="small"
          >
            Insert Frame
          </Button>
          {/* <Button variant="outlined" size="small">Connect</Button> */}
        </ButtonBar>

        {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
        <LiveUpdateManager />
      </CenteredStack>
    </Page>
  );
}

function getFrameHref() {
  const httpOverrideOrigin = import.meta.env.VITE_HTTP_PROXY_MIRROR_ORIGIN;

  if (httpOverrideOrigin) {
    return `${httpOverrideOrigin}/frame?origin=${window.location.origin}`;
  }

  return "/frame";
}
