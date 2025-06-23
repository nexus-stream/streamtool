import OBSWebSocket from "obs-websocket-js";
import { useOBSWebsocketWithStatus } from "../../../data/obs/ObsWebSocketContext";
import { useFlatData } from "../../../data/display/useFlatData";
import { useEffect } from "react";

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

  useEffect(() => {
    const toRun = async () => {
      const requestData = {
        message: `streamtool flat data${stringifiedData}`,
      };
      console.log("START", requestData);
      const result = await socket.call("CallVendorRequest", {
        vendorName: "AdvancedSceneSwitcher",
        requestType: "AdvancedSceneSwitcherMessage",
        requestData,
      });
      console.log(result);
    };
    void toRun();
  }, [socket, stringifiedData]);

  return null;
}
