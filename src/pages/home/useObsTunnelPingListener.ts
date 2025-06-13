import { obsConnectionStatus, obsPing } from "../../data/obs/tunnel/actions";
import { useTunnelActionListener } from "./useTunnelActionListener";
import {
  ObsTunnelMessage,
  wrapObsTunnelMessage,
} from "../../data/obs/tunnel/messages";
import { useOBSWebsocketWithStatus } from "../../data/obs/ObsWebSocketContext";
import { useCallback, useEffect } from "react";

export function useObsTunnelPingListener(frame: HTMLIFrameElement | null) {
  const { status } = useOBSWebsocketWithStatus();

  const listener = useCallback(() => {
    sendToFrame(frame, wrapObsTunnelMessage(obsConnectionStatus(status)));
  }, [frame, status]);

  useTunnelActionListener(obsPing, listener);

  useEffect(listener, [listener]);
}

function sendToFrame(
  frame: HTMLIFrameElement | null,
  message: ObsTunnelMessage
) {
  if (!frame) {
    return;
  }

  const child = import.meta.env.VITE_HTTPS_ORIGIN ?? "/";
  frame?.contentWindow?.postMessage(message, child);
}
