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

export function useOBSWebsocket(): OBSWebSocket | undefined {
  const socketWithStatus = useContext(ObsWebSocketContext);

  if (socketWithStatus.status !== "connected") {
    return undefined;
  }

  return socketWithStatus.socket;
}

export function useOBSWebsocketStatus() {
  return useContext(ObsWebSocketContext).status;
}

export function buildAdvancedSceneSwitcherMessage(message: string) {
  return {
    vendorName: "AdvancedSceneSwitcher",
    requestType: "AdvancedSceneSwitcherMessage",
    requestData: { message },
  } as const;
}
