import { Button, css, ToggleButton } from "@mui/material";
import { STYLES } from "../../../../style/styles";
import { useSelector } from "react-redux";
import { selectNeedsTwitchAuth } from "../../../../data/twitch/selectors";
import SyncIcon from "@mui/icons-material/Sync";
import { useAppDispatch } from "../../../../data/hooks";
import {
  clearTwitchToken,
  twitchRootSelector,
} from "../../../../data/twitch/twitchSlice";
import { selectIsTwitchSyncEnabled } from "../../../../data/config/selectors";
import { setIsTwitchSyncEnabled } from "../../../../data/config/configSlice";

export function TwitchButton() {
  const isSyncEnabled = useSelector(selectIsTwitchSyncEnabled);
  const needsAuth = useSelector(selectNeedsTwitchAuth);
  const twitchLoginName = useSelector(twitchRootSelector).login;
  const dispatch = useAppDispatch();

  if (!needsAuth) {
    return (
      <>
        <ToggleButton
          size="small"
          value="check"
          selected={isSyncEnabled}
          onChange={() => dispatch(setIsTwitchSyncEnabled(!isSyncEnabled))}
        >
          <SyncIcon />
          {isSyncEnabled
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
          Logout of Twitch {twitchLoginName ? `(${twitchLoginName})` : ""}
        </Button>
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

// oauth works by navigating to the client's page with a redirect uri to your own site
// that they'll direct to with your new authorization token in the hash parameters. We
// give them /twitch, which loads TwitchWebhookPage.
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
