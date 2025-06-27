import { FrameAutoResizer } from "./FrameAutoResizer";
import { LiveUpdateManager } from "./live-update/LiveUpdateManager";
import { ObsDataSync } from "./ObsDataSync";
import { TwitchSync } from "./TwitchSync";

export function DockedPageSyncManager() {
  return (
    <>
      {/* Handles listening for race updates from therun.gg */}
      <LiveUpdateManager />

      {/* Handles auto resizing the browser source of frames that have opted into that behavior */}
      <FrameAutoResizer />

      {/* Handles syncing current stage data to advanced scene switcher */}
      <ObsDataSync />

      {/* Handles syncing the current stage's game and title to Twitch */}
      <TwitchSync />
    </>
  );
}
