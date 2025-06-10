import { ReactNode, useEffect, useState } from "react";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import {
  OBSWebSocketWithStatus,
  ObsWebSocketContext,
} from "./ObsWebSocketContext";
import { useSelector } from "react-redux";
import { selectObsCredentials } from "./selectors";

interface Props {
  children: ReactNode;
}

export function ObsWebSocketProvider({ children }: Props) {
  const { port, password, loginTime } = useSelector(selectObsCredentials);
  const [result, setResult] = useState<OBSWebSocketWithStatus>({
    status: "idle",
  });

  useEffect(() => {
    const socket = new OBSWebSocket();
    let isCurrentRun = true;
    setResult({ status: "connecting" });

    const connect = async () => {
      const result = await socket
        .connect(`ws://127.0.0.1:${port}`, password, {
          eventSubscriptions: EventSubscription.SceneItemTransformChanged,
        })
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
  }, [port, password, loginTime]);

  return (
    <ObsWebSocketContext.Provider value={result}>
      {children}
    </ObsWebSocketContext.Provider>
  );
}
