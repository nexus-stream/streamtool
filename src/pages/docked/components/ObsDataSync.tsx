import {
  buildAdvancedSceneSwitcherMessage,
  useOBSWebsocket,
} from "../../../data/obs/ObsWebSocketContext";
import { useFlatData } from "../../../data/display/useFlatData";
import { useEffect } from "react";
import { useThrottle } from "ahooks";

export function ObsDataSync() {
  const socket = useOBSWebsocket();
  const flatData = useFlatData();
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
