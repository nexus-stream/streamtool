import { ReactNode, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { OBSWebSocketContext } from "./OBSWebSocketContext";
import { OBSLoginForm } from "./OBSLoginForm";
import { useOBSWebSocket } from "./useObsWebSocket";

interface Props {
  children: ReactNode;
}

export function OBSConnectionWrapper({ children }: Props) {
  const [port, setPort] = useLocalStorage("obs-port", 4455);
  const [password, setPassword] = useLocalStorage("obs-password", "");
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const socketAndStatus = useOBSWebSocket(port, password, loginAttemptCount);

  switch (socketAndStatus.status) {
    case "connected":
      return (
        <OBSWebSocketContext.Provider value={socketAndStatus.socket}>
          {children}
        </OBSWebSocketContext.Provider>
      );
    case "idle":
    case "login-failed":
      return (
        <OBSLoginForm
          initialPort={port}
          initialPassword={password}
          isError={socketAndStatus.status === "login-failed"}
          onSubmit={({ port, password }) => {
            setPort(port);
            setPassword(password);
            setLoginAttemptCount((old) => old + 1);
          }}
        />
      );
    case "connecting":
      return <p>Connecting...</p>;
  }
}
