import { useEffect } from "react";
import { useThrottle } from "ahooks";
import { useSelector } from "react-redux";
import { selectCurrentFlattenedDisplayData } from "../../../../data/display/selectors";
import { useOBSWebsocket } from "../../../../data/obs/ObsWebSocketContext";
import { buildAdvancedSceneSwitcherMessage } from "../../../../util/buildAdvancedSceneSwitcherMessage";

// Whenever our current stage's data changes, send it through our websocket to
// be ingested by a macro in Advanced Scene Switcher.
export function ObsDataSync() {
  const socket = useOBSWebsocket();
  const flatData = useSelector(selectCurrentFlattenedDisplayData);
  const stringifiedData = JSON.stringify(flatData, null, 2);
  const throttledData = useThrottle(stringifiedData, { wait: 1000 });

  useEffect(() => {
    const toRun = async () => {
      await socket?.call(
        "CallVendorRequest",
        buildAdvancedSceneSwitcherMessage(
          `streamtool flat data${throttledData}`
        )
      );
    };
    void toRun();
  }, [socket, throttledData]);

  return null;
}
