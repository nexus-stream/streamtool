import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";

export function DockedPage() {
  return (
    <div className="h-full w-full flex items-center justify-center flex-col">
      <StageSelector />

      <div className="flex justify-center gap-4 pt-4 flex-wrap">
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
      </div>

      {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
      <LiveUpdateManager />
    </div>
  );
}

function getFrameHref() {
  const override = import.meta.env.VITE_FRAME_ADDER_URL_OVERRIDE;
  if (override) {
    return `${import.meta.env.VITE_FRAME_ADDER_URL_OVERRIDE}?origin=${
      window.location.origin
    }`;
  }

  return "/frame";
}
