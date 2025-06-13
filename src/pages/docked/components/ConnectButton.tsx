import { Button, css } from "@mui/material";
import { STYLES } from "../../../components/styles";
import { useObsTunnelStatus } from "../../../data/obs/tunnel/useObsTunnelStatus";

export function ConnectButton() {
  const status = useObsTunnelStatus();

  const origin = import.meta.env.VITE_HTTP_ORIGIN ?? window.location.origin;

  switch (status) {
    case "idle":
    case "login-failed":
      return (
        <Button
          css={buttonStyle}
          variant="outlined"
          href={`${origin}/connect`}
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
  ${STYLES.fullWidth};
  background: #85144b;
`;
