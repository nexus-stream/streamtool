import { createAction } from "@reduxjs/toolkit";
import { OBSWebSocketWithStatus } from "../ObsWebSocketContext";

export const OBS_TUNNEL_ACTION_PREDICATE = "obs-tunnel";

export const obsPing = createAction(`${OBS_TUNNEL_ACTION_PREDICATE}/ping`);

export const obsConnectionStatus = createAction<
  OBSWebSocketWithStatus["status"]
>(`${OBS_TUNNEL_ACTION_PREDICATE}/connectionStatus`);

export const obsInsertBrowserSource = createAction<{
  url: string;
  name: string;
  width: number;
  height: number;
}>(`${OBS_TUNNEL_ACTION_PREDICATE}/insertBrowserSource`);
