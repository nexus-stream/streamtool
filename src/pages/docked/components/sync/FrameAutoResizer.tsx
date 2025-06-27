import { useEffect } from "react";
import { useOBSWebsocket } from "../../../../data/obs/ObsWebSocketContext";
import { FrameComponent } from "../../../browser-source/frame";
import { FRAMES } from "../../../browser-source/frames";

// OBS has two sizes for browser sources - the size the item takes up in your OBS scene,
// and the size that the browser renders the page at. These sizes do not sync up, so if
// you resize a browser source, it will continue rendering at the original size.
//
// I assume they mainly do this because duplicating a browser source is a common pattern
// and they want to only have to render the page once in that case even if you resize one
// of the duplicated sources.
//
// We don't want that with (all) frames generated with this tool though, because it's mostly
// rendering text and text sizes should remain consistent thoughout the layout.
//
// This component listens for resize events for all frames that have "autoResize" set to
// true in their display properties and sets that source to render the page at the item's
// new size in OBS. Lots of ugly hacks in here, but because it'll only really be used when
// layouts are being created and shouldn't be doing much during an event, I think a bit of
// jank's alright.
export function FrameAutoResizer() {
  const socket = useOBSWebsocket();

  useEffect(() => {
    const debouncer = new MappedDebouncer(200);

    socket?.addListener(
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
