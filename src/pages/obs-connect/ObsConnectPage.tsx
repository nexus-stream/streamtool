import { useCallback } from "react";
import { useAppDispatch } from "../../data/hooks";
import { loginToObs } from "../../data/obs/obsSlice";
import { useOBSWebsocketStatus } from "../../data/obs/ObsWebSocketContext";
import { OBSLoginForm } from "./components/OBSLoginForm";
import { useSelector } from "react-redux";
import { selectObsCredentials } from "../../data/obs/selectors";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";

// Page that lets us connect to obs-websocket.
export function ObsConnectPage() {
  return (
    <ObsWebSocketProvider>
      <ObsConnectPanel />
    </ObsWebSocketProvider>
  );
}

export function ObsConnectPanel() {
  const dispatch = useAppDispatch();

  const status = useOBSWebsocketStatus();
  const { port, password } = useSelector(selectObsCredentials);

  const onSubmit = useCallback(
    (credentials: { port: string; password: string }) => {
      dispatch(loginToObs(credentials));
    },
    [dispatch]
  );

  switch (status) {
    case "connected":
      return <p>Connected to OBS</p>;
    case "idle":
    case "login-failed":
      return (
        <OBSLoginForm
          initialPort={port}
          initialPassword={password}
          isError={status === "login-failed"}
          onSubmit={onSubmit}
        />
      );
    case "connecting":
      return <p>Connecting...</p>;
  }
}
