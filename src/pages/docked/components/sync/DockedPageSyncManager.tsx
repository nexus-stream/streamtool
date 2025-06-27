import { FrameAutoResizer } from "./FrameAutoResizer";
import { TheRunLiveUpdateManager } from "./live-update/TheRunLiveUpdateManager";
import { ObsDataSync } from "./ObsDataSync";
import { TwitchSync } from "./TwitchSync";

// We have a set of ongoing tasks that we want to run at all times, and only want to
// run in one place. This makes the docked page the best place to put them. Some of
// these should probably be hooks rather than components, but I started with
// TheRunLiveUpdateManager which made more sense as a component and just followed
// that pattern with the others.
export function DockedPageSyncManager() {
  return (
    <>
      {/* Handles listening for race updates from therun.gg and dispatching them into Redux */}
      <TheRunLiveUpdateManager />

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
