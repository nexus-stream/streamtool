import OBSWebSocket from "obs-websocket-js";
import { RunInfo } from "../../types";
import { useOBSCPanelOverlayResponder } from "./useOBSPanelOverlayResponder";
import { useOBSCPanelTwitchUpdater } from "./useOBSPanelTwitchUpdater";

interface Props {
  socket: OBSWebSocket;
  runInfo: RunInfo;
}

export function OBSPanelAdapter({ socket, runInfo }: Props) {
  useOBSCPanelOverlayResponder(socket, runInfo);
  useOBSCPanelTwitchUpdater(socket, runInfo);

  return null;
}
