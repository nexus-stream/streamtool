import { ReactNode, useCallback } from "react";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { Button } from "@mui/material";
import { buildAdvancedSceneSwitcherMessage } from "../../../util/buildAdvancedSceneSwitcherMessage";

interface Props {
  name: string;
  children: ReactNode;
}

export function AdvancedSceneSwitcherMessageButton({ name, children }: Props) {
  const socket = useOBSWebsocket();

  const onClick = useCallback(async () => {
    if (!socket) {
      return;
    }

    await socket.call(
      "CallVendorRequest",
      buildAdvancedSceneSwitcherMessage(`streamtool event: ${name}`)
    );
  }, [name, socket]);

  return (
    <Button variant="outlined" size="small" onClick={onClick}>
      {children}
    </Button>
  );
}
