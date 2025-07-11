import { Button, css } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../data/hooks";
import { loginToObs } from "../../../../data/obs/obsSlice";
import { useOBSWebsocketStatus } from "../../../../data/obs/ObsWebSocketContext";
import { selectObsCredentials } from "../../../../data/obs/selectors";
import { STYLES } from "../../../../style/styles";

export function OBSConnectButton() {
  const dispatch = useAppDispatch();
  const status = useOBSWebsocketStatus();
  const currentCredentials = useSelector(selectObsCredentials);

  const onClick = useCallback(() => {
    dispatch(loginToObs(currentCredentials));
  }, [currentCredentials, dispatch]);

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
          onClick={onClick}
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
