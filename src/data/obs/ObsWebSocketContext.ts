import OBSWebSocket from "obs-websocket-js";
import { createContext, useContext } from "react";

interface Idle {
  status: "idle";
}

interface Connected {
  status: "connected";
  socket: OBSWebSocket;
}

interface LoginFailed {
  status: "login-failed";
}

interface Connecting {
  status: "connecting";
}

export type OBSWebSocketWithStatus =
  | Idle
  | Connected
  | LoginFailed
  | Connecting;

export const ObsWebSocketContext = createContext<OBSWebSocketWithStatus>({
  status: "idle",
});

export function useOBSWebsocketWithStatus(): OBSWebSocketWithStatus {
  return useContext(ObsWebSocketContext);
}

export function useOBSWebsocket(): OBSWebSocket {
  const socketWithStatus = useContext(ObsWebSocketContext);

  if (socketWithStatus.status !== "connected") {
    throw new Error("Not connected!");
  }

  return socketWithStatus.socket;
}
