import { useCallback, useEffect, useRef } from "react";
import { castEventData, OverlayInfo } from "../../types";
import OBSWebSocket from "obs-websocket-js";

export function useOBSCPanelOverlayResponder(
  socket: OBSWebSocket | undefined,
  overlayInfo: OverlayInfo
) {
  const overlayInfoRef = useRef<OverlayInfo | null>(null);

  const broadcastOverlayState = useCallback(() => {
    if (!socket) {
      return;
    }

    if (overlayInfoRef.current === null) {
      return;
    }

    socket.call("BroadcastCustomEvent", {
      eventData: overlayInfoRef.current as unknown as {
        [Key in string]: string;
      },
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("CustomEvent", ({ eventData }) => {
      const payload = castEventData(eventData);
      if (payload.kind === "OverlayInfoRequest") {
        broadcastOverlayState();
      }
    });
  }, [socket]);

  useEffect(() => {
    overlayInfoRef.current = overlayInfo;
    broadcastOverlayState();
  }, [overlayInfo]);
}
