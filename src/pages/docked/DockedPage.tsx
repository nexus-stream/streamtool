import { Divider, IconButton, Tooltip, css } from "@mui/material";
import DvrIcon from "@mui/icons-material/Dvr";
import LayersIcon from "@mui/icons-material/Layers";
import RefreshIcon from "@mui/icons-material/Refresh";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../data/hooks";
import { reloadAllTabs } from "../../data/app/appActions";
import { loginToObs } from "../../data/obs/obsSlice";
import { useOBSWebsocketStatus } from "../../data/obs/ObsWebSocketContext";
import { selectObsCredentials } from "../../data/obs/selectors";
import { selectNeedsTwitchAuth } from "../../data/twitch/selectors";
import { clearTwitchToken, twitchRootSelector } from "../../data/twitch/twitchSlice";
import { selectIsTwitchSyncEnabled } from "../../data/config/selectors";
import { setIsTwitchSyncEnabled } from "../../data/config/configSlice";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { AdminContainer } from "./components/AdminContainer";
import { DockedPageSyncManager } from "./components/sync/DockedPageSyncManager";
import { TheRunWebSocketProvider } from "./components/sync/live-update/TheRunWebSocketProvider";
import { useTheRunStatus } from "./components/sync/live-update/TheRunWebSocketContext";
import { useDockedPageHotkeys } from "./hooks/useDockedPageHotkeys";
import { StatusIcon, StatusTone } from "./components/StatusIcon";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "shortOffset",
});

const formattedBuildTimeString = import.meta.env.VITE_BUILD_TIME
  ? dateTimeFormatter.format(parseInt(import.meta.env.VITE_BUILD_TIME))
  : "Unknown";

// The page that lives in the custom dock on OBS. Because this page always exists when
// the tool is in use and there's only ever one of them, it handles a lot of behind the
// scenes integration stuff with OBS and Twitch.
//
// Kept compact (100x100 legible) with three top-to-bottom groups:
// 1. Connection Status (OBS logo, Twitch logo, TheRun logo)
// 2. Windows (Stage Manager, Add Frames)
// 3. Debug (Refresh All Tabs, Logout Twitch, View Debug Data, Build Time)
export function DockedPage() {
  useDockedPageHotkeys();

  return (
    <TheRunWebSocketProvider>
      <ObsWebSocketProvider>
        <DockedView />
      </ObsWebSocketProvider>
    </TheRunWebSocketProvider>
  );
}

function DockedView() {
  const dispatch = useAppDispatch();
  const obsStatus = useOBSWebsocketStatus();
  const currentCredentials = useSelector(selectObsCredentials);

  const isTwitchSyncEnabled = useSelector(selectIsTwitchSyncEnabled);
  const needsTwitchAuth = useSelector(selectNeedsTwitchAuth);
  const twitchLoginName = useSelector(twitchRootSelector).login;

  const theRunStatus = useTheRunStatus();

  const isObsConnected = obsStatus === "connected";

  const onObsClick = useCallback(() => {
    if (obsStatus === "idle" || obsStatus === "login-failed") {
      dispatch(loginToObs(currentCredentials));
    } else {
      window.open("/connect", "_blank");
    }
  }, [currentCredentials, dispatch, obsStatus]);

  const onTwitchClick = useCallback(() => {
    if (needsTwitchAuth) {
      window.open(buildTwitchAuthUrl(), "_blank");
    } else {
      dispatch(setIsTwitchSyncEnabled(!isTwitchSyncEnabled));
    }
  }, [dispatch, isTwitchSyncEnabled, needsTwitchAuth]);

  const onLogoutTwitch = useCallback(() => {
    dispatch(clearTwitchToken());
  }, [dispatch]);

  const onRefreshTabs = useCallback(() => {
    dispatch(reloadAllTabs());
  }, [dispatch]);

  const onOpenStageManager = useCallback(() => {
    window.open("/stage-manager", "_blank");
  }, []);

  const onOpenFrames = useCallback(() => {
    window.open("/frame", "_blank");
  }, []);

  const onOpenDebug = useCallback(() => {
    window.open("/debug", "_blank");
  }, []);

  const obsTone: StatusTone = isObsConnected
    ? "connected"
    : obsStatus === "connecting"
    ? "connecting"
    : "disconnected";

  const obsTooltip = isObsConnected
    ? "OBS: Connected (click to manage connection)"
    : obsStatus === "connecting"
    ? "OBS: Connecting..."
    : "OBS: Disconnected (click to connect)";

  const twitchTone: StatusTone = needsTwitchAuth
    ? "disconnected"
    : isTwitchSyncEnabled
    ? "connected"
    : "inactive";

  const twitchTooltip = needsTwitchAuth
    ? "Twitch: Not connected (click to login)"
    : isTwitchSyncEnabled
    ? `Twitch (${twitchLoginName ?? "connected"}): Sync ON (click to disable)`
    : `Twitch (${twitchLoginName ?? "connected"}): Sync OFF (click to enable)`;

  const theRunTone: StatusTone =
    theRunStatus === "connected"
      ? "connected"
      : theRunStatus === "connecting"
      ? "connecting"
      : theRunStatus === "error"
      ? "disconnected"
      : "idle";

  const theRunTooltip =
    theRunStatus === "connected"
      ? "TheRun: Connected"
      : theRunStatus === "connecting"
      ? "TheRun: Connecting..."
      : theRunStatus === "error"
      ? "TheRun: Connection error"
      : "TheRun: Idle (no active race)";

  return (
    <div css={dockContainerStyle}>
      {/* 1. Connection Status: OBS connection, Twitch connection/sync, TheRun status */}
      <div css={buttonRowStyle}>
        <Tooltip title={obsTooltip} arrow placement="top">
          <IconButton
            size="small"
            onClick={onObsClick}
            aria-label="OBS Status"
            css={iconButtonStyle}
          >
            <StatusIcon src="/obs.png" alt="OBS" status={obsTone} />
          </IconButton>
        </Tooltip>

        <Tooltip title={twitchTooltip} arrow placement="top">
          <IconButton
            size="small"
            onClick={onTwitchClick}
            aria-label="Twitch Status"
            css={iconButtonStyle}
          >
            <StatusIcon src="/twitch.png" alt="Twitch" status={twitchTone} />
          </IconButton>
        </Tooltip>

        {/* Informative-only status indicator for TheRun websocket */}
        <Tooltip title={theRunTooltip} arrow placement="top">
          <span
            tabIndex={0}
            role="status"
            aria-label={theRunTooltip}
            css={statusIndicatorStyle}
          >
            <IconButton
              size="small"
              component="span"
              disableRipple
              tabIndex={-1}
              aria-hidden="true"
              css={inertIconStyle}
            >
              <StatusIcon src="/therun.png" alt="TheRun" status={theRunTone} />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      {/* 2. Windows: Stage Manager, Add Frames */}
      <div css={buttonRowStyle}>
        <Tooltip title="Open Stage Manager" arrow placement="top">
          <IconButton
            size="small"
            color="primary"
            onClick={onOpenStageManager}
            aria-label="Open Stage Manager"
            css={iconButtonStyle}
          >
            <DvrIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <AdminContainer>
          <Tooltip title="Add Frames" arrow placement="top">
            <IconButton
              size="small"
              onClick={onOpenFrames}
              aria-label="Add Frames"
              css={iconButtonStyle}
            >
              <LayersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </AdminContainer>
      </div>

      {/* 3. Debug: Divider + smaller action buttons */}
      <AdminContainer>
        <div css={debugSectionStyle}>
          <Divider css={dividerStyle} />
          <div css={debugButtonRowStyle}>
            <Tooltip title="Refresh All Tabs" arrow placement="bottom">
              <IconButton
                size="small"
                onClick={onRefreshTabs}
                aria-label="Refresh All Tabs"
                css={debugIconButtonStyle}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            {!needsTwitchAuth && (
              <Tooltip
                title={`Sign out of Twitch (${twitchLoginName ?? "connected"})`}
                arrow
                placement="bottom"
              >
                <IconButton
                  size="small"
                  onClick={onLogoutTwitch}
                  aria-label="Sign out of Twitch"
                  css={debugIconButtonStyle}
                >
                  <LogoutIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="View Debug Data" arrow placement="bottom">
              <IconButton
                size="small"
                onClick={onOpenDebug}
                aria-label="View Debug Data"
                css={debugIconButtonStyle}
              >
                <BugReportIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Build Time: ${formattedBuildTimeString}`} arrow placement="bottom">
              <IconButton
                size="small"
                aria-label={`Build Time: ${formattedBuildTimeString}`}
                css={debugIconButtonStyle}
              >
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </AdminContainer>

      <DockedPageSyncManager />
    </div>
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

const dockContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 3px;
  box-sizing: border-box;
  overflow: hidden;
`;

const buttonRowStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
`;

const iconButtonStyle = css`
  padding: 3px;
  min-width: 26px;
  min-height: 26px;
`;

const statusIndicatorStyle = css`
  display: inline-flex;
  outline: none;
`;

const inertIconStyle = css`
  padding: 3px;
  min-width: 26px;
  min-height: 26px;
  cursor: default;
  pointer-events: none;
`;

const debugSectionStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
`;

const dividerStyle = css`
  width: 80%;
  border-color: rgba(255, 255, 255, 0.12);
  margin: 1px 0;
`;

const debugButtonRowStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
`;

const debugIconButtonStyle = css`
  padding: 2px;
  min-width: 20px;
  min-height: 20px;
  opacity: 0.75;
  &:hover {
    opacity: 1;
  }
`;
