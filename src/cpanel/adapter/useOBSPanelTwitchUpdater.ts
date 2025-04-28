import { useEffect } from "react";
import { RunInfo } from "../../types";
import OBSWebSocket from "obs-websocket-js";

export function useOBSCPanelTwitchUpdater(
  socket: OBSWebSocket | undefined,
  { game, streamTitle }: RunInfo
) {
  useEffect(() => {
    console.log("RUNNING EFFECT");

    if (!socket) {
      return;
    }

    console.log("REALLY RUNNING EFFECT");
    (window as any).kyleTest = async () => {
      return await socket.call("GetStreamServiceSettings");
    };

    // Do something with socket.call to update this
  }, [socket, game, streamTitle]);
}
