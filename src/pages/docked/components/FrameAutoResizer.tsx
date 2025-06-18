import OBSWebSocket from "obs-websocket-js";
import { useOBSWebsocketWithStatus } from "../../../data/obs/ObsWebSocketContext";
import { useEffect } from "react";
import { FrameComponent } from "../../browser-source/frame";
import { FRAMES } from "../../browser-source/frames";

export function FrameAutoResizer() {
  const socketAndStatus = useOBSWebsocketWithStatus();

  if (socketAndStatus.status === "connected") {
    return <FrameAutoResizerInner socket={socketAndStatus.socket} />;
  }

  return null;
}

function FrameAutoResizerInner({ socket }: { socket: OBSWebSocket }) {
  useEffect(() => {
    const debouncer = new MappedDebouncer(200);

    socket.addListener(
      "SceneItemTransformChanged",
      async ({ sceneUuid, sceneItemId, sceneItemTransform }) => {
        if (
          sceneItemTransform.scaleX === 1 &&
          sceneItemTransform.scaleY === 1
        ) {
          return;
        }

        const key = getSceneItemKey(sceneUuid, sceneItemId);
        debouncer.run(key, async () => {
          const item = await socket.call("GetSceneItemSource", {
            sceneUuid,
            sceneItemId,
          });

          const input = await socket.call("GetInputSettings", {
            inputUuid: item.sourceUuid,
          });

          const frame = getInputFrame(input);
          if (!frame || !frame.displayProperties.autoResize) {
            return;
          }

          const newWidth = sceneItemTransform.width as number;
          const newHeight = sceneItemTransform.height as number;
          if (newWidth < 10 || newHeight < 10) {
            return;
          }

          await socket.callBatch([
            {
              requestType: "SetSceneItemTransform",
              requestData: {
                sceneUuid,
                sceneItemId,
                sceneItemTransform: {
                  scaleX: 1,
                  scaleY: 1,
                },
              },
            },
            {
              requestType: "SetInputSettings",
              requestData: {
                inputUuid: item.sourceUuid,
                inputSettings: {
                  width: newWidth,
                  height: newHeight,
                },
              },
            },
          ]);
        });
      }
    );
  }, [socket]);

  return null;
}

class MappedDebouncer {
  private readonly timeoutMap = new Map<string, number>();

  constructor(private readonly debounceTime: number) {}

  run(key: string, fn: () => void) {
    clearTimeout(this.timeoutMap.get(key));
    this.timeoutMap.set(key, setTimeout(fn, this.debounceTime));
  }
}

function getSceneItemKey(sceneUuid: string, sceneItemId: number): string {
  return `${sceneUuid}__${sceneItemId}`;
}

const framePathnameRegex = /^\/frame\/([^/]+)$/;

function getInputFrame({
  inputSettings,
  inputKind,
}: {
  inputSettings: { [key: string]: unknown };
  inputKind: string;
}): FrameComponent | undefined {
  if (inputKind !== "browser_source" || typeof inputSettings.url !== "string") {
    return undefined;
  }

  const frameOrigin = window.location.origin;
  const inputUrl = new URL(inputSettings.url);
  if (inputUrl.origin !== frameOrigin) {
    return undefined;
  }

  const frameId = inputUrl.pathname.match(framePathnameRegex)?.[1];
  if (!frameId) {
    return undefined;
  }

  return FRAMES[frameId];
}
