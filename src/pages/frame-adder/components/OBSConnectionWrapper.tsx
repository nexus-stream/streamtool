import { ReactNode } from "react";
import { useOBSWebsocketStatus } from "../../../data/obs/ObsWebSocketContext";

interface Props {
  children: ReactNode;
}

export function OBSConnectionWrapper({ children }: Props) {
  const status = useOBSWebsocketStatus();

  switch (status) {
    case "connected":
      return children;
    case "idle":
    case "login-failed":
      return <p>You need to connect to OBS to use this.</p>;
    case "connecting":
      return null;
  }
}
