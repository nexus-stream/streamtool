import { useCallback, useState } from "react";
import { RunInfo } from "../types";
import { useOBSSocket } from "../useOBSSocket";
import { OBSPanelAdapter } from "./adapter/OBSPanelAdapter";
import { Button, TextField, Text } from "@radix-ui/themes";

interface Props {
  runInfo?: RunInfo;
}

export function ConnectWrapper({ runInfo }: Props) {
  const [port, setPort] = useState(4455);
  const [password, setPassword] = useState("");

  const [commitPort, setCommitPort] = useState<number | undefined>();
  const [commitPassword, setCommitPassword] = useState<string | undefined>();

  const socket = useOBSSocket(commitPort, commitPassword);

  const commit = useCallback(() => {
    setCommitPort(port);
    setCommitPassword(password);
  }, [port, password]);

  return (
    <div>
      <TextField.Root
        type="number"
        value={port}
        onChange={(event) => setPort(parseInt(event.target.value))}
      />

      <TextField.Root
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <Button onClick={commit}>Connect</Button>

      <Text>{socket ? "Connected" : "Disconnected"}</Text>

      {runInfo && socket && (
        <OBSPanelAdapter socket={socket} runInfo={runInfo} />
      )}
    </div>
  );
}
