import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { useEffect } from "react";
import { useThrottle } from "ahooks";
import { buildAdvancedSceneSwitcherMessage } from "../../../util/buildAdvancedSceneSwitcherMessage";
import { useSelector } from "react-redux";
import { selectCurrentFlattenedDisplayData } from "../../../data/display/selectors";

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
