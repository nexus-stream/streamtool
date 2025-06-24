import OBSWebSocket from "obs-websocket-js";
import { useOBSWebsocketWithStatus } from "../../../data/obs/ObsWebSocketContext";
import { useFlatData } from "../../../data/display/useFlatData";
import { useEffect } from "react";
import { useThrottle } from "ahooks";

export function ObsDataSync() {
  const socketWithStatus = useOBSWebsocketWithStatus();

  if (socketWithStatus.status !== "connected") {
    return null;
  }

  return <ObsDataSyncInner socket={socketWithStatus.socket} />;
}

function ObsDataSyncInner({ socket }: { socket: OBSWebSocket }) {
  const flatData = useFlatData();
  const stringifiedData = JSON.stringify(flatData, null, 2);
  const throttledData = useThrottle(stringifiedData, { wait: 1000 });

  useEffect(() => {
    const toRun = async () => {
      const requestData = {
        message: `streamtool flat data${throttledData}`,
      };
      await socket.call("CallVendorRequest", {
        vendorName: "AdvancedSceneSwitcher",
        requestType: "AdvancedSceneSwitcherMessage",
        requestData,
      });
    };
    void toRun();
  }, [socket, throttledData]);

  return null;
}
