import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

export function useOBSSocket(port?: number, password?: string) {
  const [socket, setSocket] = useState<OBSWebSocket>();

  useEffect(() => {
    if (port === undefined || password === undefined) {
      return;
    }

    let isCurrentRun = true;

    const newSocket = new OBSWebSocket();

    const asyncWork = async () => {
      try {
        console.log("TRYING CONNECT", port, password);
        await newSocket.connect(`ws://localhost:${port}`, password);

        if (isCurrentRun) {
          setSocket(newSocket);
        }
      } catch {
        if (isCurrentRun) {
          setSocket(undefined);
        }
      }
    };
    void asyncWork();

    return () => {
      isCurrentRun = false;
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [port, password]);

  return socket;
}
