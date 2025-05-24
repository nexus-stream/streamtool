import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { Button } from "@mui/material";
import { StageSelector } from "./components/StageSelector";

export function DockedPage() {
  return (
    <div className="h-full w-full flex items-center justify-center flex-col">
      <StageSelector />

      <div className="flex justify-center gap-4 pt-4 flex-wrap">
        <Button variant="outlined" href="/edit" target="_blank">
          Edit
        </Button>
        <Button variant="outlined" href="/frame" target="_blank">
          Insert
        </Button>
        <Button variant="outlined">Connect</Button>
      </div>

      {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
      <LiveUpdateManager />
    </div>
  );
}
