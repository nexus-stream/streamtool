import OBSWebSocket from "obs-websocket-js";
import { createContext, useContext } from "react";

export const OBSWebSocketContext = createContext<OBSWebSocket>(null!);

export function useOBSWebsocket() {
  return useContext(OBSWebSocketContext);
}
