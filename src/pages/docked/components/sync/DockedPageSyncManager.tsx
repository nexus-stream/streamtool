import { FrameAutoResizer } from "./FrameAutoResizer";
import { LiveUpdateManager } from "./live-update/LiveUpdateManager";
import { ObsDataSync } from "./ObsDataSync";
import { TwitchSync } from "./TwitchSync";

// We have a set of ongoing tasks that we want to run at all times, and only want to
// run in one place. This makes the docked page the best place to put them.
export function DockedPageSyncManager() {
  return (
    <>
      {/* Handles listening for race updates from therun.gg and dispatching them into Redux */}
      <LiveUpdateManager />

      {/* Handles auto resizing the browser source of frames that have opted into that behavior.
          I suppose this stretches the definition of "sync", but whatever, naming stuff is hard. */}
      <FrameAutoResizer />

      {/* Handles sending current stage data to advanced scene switcher through the OBS websocket */}
      <ObsDataSync />

      {/* Handles sending the current stage's game and title to Twitch */}
      <TwitchSync />
    </>
  );
}
