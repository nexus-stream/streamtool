import { useEffect, useState } from "react";
import { castEventData, OverlayInfo, OverlayInfoRequest } from "../../types";
import { useOBSSocket } from "../../useOBSSocket";

export function useOBSOverlayInfo(
  port: number,
  password: string
): OverlayInfo | undefined {
  const socket = useOBSSocket(port, password);
  const [overlayInfo, setOverlayInfo] = useState<OverlayInfo | undefined>();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("CustomEvent", ({ eventData }) => {
      const payload = castEventData(eventData);
      if (payload.kind === "OverlayInfoResponse") {
        setOverlayInfo(payload.data);
      }
    });

    const request: OverlayInfoRequest = {
      kind: "OverlayInfoRequest",
    };
    socket.call("BroadcastCustomEvent", {
      eventData: request as unknown as { [key: string]: string },
    });
  }, [socket]);

  return overlayInfo;
}
