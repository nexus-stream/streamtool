import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

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

export function useOBSWebSocket(
  port: number,
  password: string,
  loginAttemptCount: number
): OBSWebSocketWithStatus {
  const [result, setResult] = useState<OBSWebSocketWithStatus>({
    status: "idle",
  });

  useEffect(() => {
    const socket = new OBSWebSocket();
    let isCurrentRun = true;
    setResult({ status: "connecting" });

    const connect = async () => {
      const result = await socket
        .connect(`ws://127.0.0.1:${port}`, password)
        .then(() => true)
        .catch(() => false);

      if (!isCurrentRun) {
        return;
      }

      if (result) {
        socket.addListener("ConnectionClosed", () => {
          setResult({ status: "login-failed" });
        });
        setResult({ status: "connected", socket });
      } else {
        setResult({ status: "login-failed" });
      }
    };
    void connect();

    return () => {
      socket.disconnect();
      isCurrentRun = false;
    };
  }, [port, password, loginAttemptCount]);

  return result;
}
