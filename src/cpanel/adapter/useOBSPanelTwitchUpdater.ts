import { useEffect } from "react";
import { RunInfo } from "../../types";
import OBSWebSocket from "obs-websocket-js";

export function useOBSCPanelTwitchUpdater(
  socket: OBSWebSocket | undefined,
  { game, streamTitle }: RunInfo
) {
  useEffect(() => {
    if (!socket) {
      return;
    }

    // Do something with socket.call to update this
  }, [socket, game, streamTitle]);
}
