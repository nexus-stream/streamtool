import { useEffect, useRef } from "react";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { parseOBSOverlayURL } from "../../browser-source/overlayUrl";

// The config for a frame we've loaded from a selected scene item. `params` are the
// already-zod-parsed values, so they can be dropped straight into the form state.
export interface LoadedFrame {
  inputUuid: string;
  inputName: string;
  frameId: string;
  params: object;
}

interface Props {
  onSelect: (frame: LoadedFrame | undefined) => void;
}

// Listens for the user selecting a scene item in OBS, resolves it to a streamtool
// frame (if it is one), and hands the parsed config back up so the form can reflect
// it. Selecting something that isn't one of our frames clears the selection.
export function FrameSelectListener({ onSelect }: Props) {
  const socket = useOBSWebsocket();
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleSelected = async ({
      sceneUuid,
      sceneItemId,
    }: {
      sceneUuid: string;
      sceneItemId: number;
    }) => {
      try {
        const item = await socket.call("GetSceneItemSource", {
          sceneUuid,
          sceneItemId,
        });
        const input = await socket.call("GetInputSettings", {
          inputUuid: item.sourceUuid,
        });
        const parsed = parseOBSOverlayURL(input.inputSettings, input.inputKind);

        if (!parsed) {
          onSelectRef.current(undefined);
          return;
        }

        let params: object;
        try {
          params = parsed.frame.zodProps.parse(parsed.rawParams);
        } catch {
          params = parsed.frame.zodProps.parse({});
        }

        onSelectRef.current({
          inputUuid: item.sourceUuid,
          inputName: item.sourceName,
          frameId: parsed.frameId,
          params,
        });
      } catch {
        onSelectRef.current(undefined);
      }
    };

    socket.addListener("SceneItemSelected", handleSelected);
    return () => {
      socket.removeListener("SceneItemSelected", handleSelected);
    };
  }, [socket]);

  return null;
}
