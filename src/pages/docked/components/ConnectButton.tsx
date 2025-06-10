import { Button, css } from "@mui/material";
import { useOBSWebsocketWithStatus } from "../../../data/obs/ObsWebSocketContext";

export function ConnectButton() {
  const { status } = useOBSWebsocketWithStatus();

  switch (status) {
    case "idle":
    case "login-failed":
      return (
        <Button
          css={buttonStyle}
          variant="outlined"
          href="/connect"
          target="_blank"
          size="small"
        >
          Connect to OBS
        </Button>
      );
    default:
      return null;
  }
}

const buttonStyle = css`
  background: #85144b;
`;
