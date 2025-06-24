import { Button, css, ToggleButton } from "@mui/material";
import { STYLES } from "../../../components/styles";
import { useSelector } from "react-redux";
import { selectNeedsTwitchAuth } from "../../../data/twitch/selectors";
import { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import { TwitchSync } from "./TwitchSync";
import { useAppDispatch } from "../../../data/hooks";
import { clearTwitchToken } from "../../../data/twitch/twitchSlice";

export function TwitchButton() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const needsAuth = useSelector(selectNeedsTwitchAuth);
  const dispatch = useAppDispatch();

  if (!needsAuth) {
    return (
      <>
        <ToggleButton
          size="small"
          value="check"
          selected={syncEnabled}
          onChange={() => setSyncEnabled((old) => !old)}
        >
          <SyncIcon />
          {syncEnabled
            ? "Twitch Game/Title Sync Enabled"
            : "Enable Twitch Sync"}
        </ToggleButton>

        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            dispatch(clearTwitchToken());
          }}
        >
          Logout of Twitch
        </Button>

        {/* Handles syncing game and stream title with Twitch. Should only ever be running in one place. */}
        {syncEnabled && <TwitchSync />}
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
