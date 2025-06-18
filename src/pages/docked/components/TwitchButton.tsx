import { Button, css, ToggleButton } from "@mui/material";
import { STYLES } from "../../../components/styles";
import { useSelector } from "react-redux";
import { selectNeedsTwitchAuth } from "../../../data/twitch/selectors";
import { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import { TwitchSync } from "./TwitchSync";

export function TwitchButton() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const needsAuth = useSelector(selectNeedsTwitchAuth);

  if (!needsAuth) {
    return (
      <>
        <ToggleButton
          size="small"
          value="check"
          selected={syncEnabled}
          onChange={() => setSyncEnabled((old) => !old)}
        >
          <SyncIcon />{" "}
          {syncEnabled ? "Twitch Sync Enabled" : "Enable Twitch Sync"}
        </ToggleButton>

        {/* Handles syncing game and stream title with Twitch. Should only ever be running in one place. */}
        <TwitchSync />
      </>
    );
  }

  return (
    <Button
      css={buttonStyle}
      variant="outlined"
      href={buildTwitchAuthUrl()}
      target="_blank"
      size="small"
    >
      Connect to Twitch
    </Button>
  );
}

function buildTwitchAuthUrl() {
  const redirectUrl = new URL("/twitch", window.location.origin);

  const url = new URL("/oauth2/authorize", "https://id.twitch.tv");
  url.searchParams.append("response_type", "token");
  url.searchParams.append("client_id", import.meta.env.VITE_TWITCH_CLIENT_ID);
  url.searchParams.append("redirect_uri", redirectUrl.toString());
  url.searchParams.append("scope", "channel:manage:broadcast");

  return url.toString();
}

const buttonStyle = css`
  ${STYLES.fullWidth};
  background: #85144b;
`;
