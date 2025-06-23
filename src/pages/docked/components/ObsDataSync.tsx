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

  useEffect(() => {
    const toRun = async () => {
      const requestData = {
        message: `streamtool flat data${JSON.stringify(flatData, null, 2)}`,
        // message: "test-message",
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
  }, [socket, flatData]);

  return null;
}

// {
//     "d": {
//         "requestData": {
//             "requestData": {
//                 "message": "testing"
//             },
//             "requestType": "AdvancedSceneSwitcherMessage",
//             "vendorName": "AdvancedSceneSwitcher"
//         },
//         "requestId": "someUniqueIdHere",
//         "requestType": "CallVendorRequest"
//     },
//     "op": 6
// }
