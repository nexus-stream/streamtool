import { obsInsertBrowserSource } from "../../data/obs/tunnel/actions";
import { useTunnelActionListener } from "./useTunnelActionListener";
import { useOBSWebsocketWithStatus } from "../../data/obs/ObsWebSocketContext";
import { useCallback } from "react";
import { PayloadAction } from "@reduxjs/toolkit";

export function useObsTunnelAddBrowserSourceListener() {
  const socketWithStatus = useOBSWebsocketWithStatus();

  const listener = useCallback(
    async ({
      payload,
    }: PayloadAction<{
      url: string;
      name: string;
      width: number;
      height: number;
    }>) => {
      if (socketWithStatus.status !== "connected") {
        return;
      }

      const obsSocket = socketWithStatus.socket;

      const sceneInfo = await obsSocket.call("GetSceneList");
      const sceneToInsertTo = sceneInfo.currentProgramSceneUuid;
      await obsSocket.call("CreateInput", {
        inputName: payload.name,
        sceneUuid: sceneToInsertTo,
        inputKind: "browser_source",
        inputSettings: {
          url: payload.url,
          width: payload.width,
          height: payload.height,
        },
      });
    },
    [socketWithStatus]
  );

  useTunnelActionListener(obsInsertBrowserSource, listener);
}
