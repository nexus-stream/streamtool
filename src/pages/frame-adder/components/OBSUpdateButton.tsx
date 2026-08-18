import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";

// The scene-item identity of the input being edited. Narrower than the listener's
// LoadedFrame because the button doesn't need the parsed params.
export interface SelectedFrame {
  inputUuid: string;
  inputName: string;
  frameId: string;
}

interface Props {
  url: string;
  name: string;
  width: number;
  height: number;
  frameId: string;
  selectedFrame: SelectedFrame;
}

// Overwrites the currently selected frame in OBS with the form's current config.
// Only the URL changes when the frame type is unchanged, so any on-stage resize the
// user made is preserved; switching frame types also updates the rendered size to the
// new frame's defaults.
export function OBSUpdateButton({
  url,
  name,
  width,
  height,
  frameId,
  selectedFrame,
}: Props) {
  const socket = useOBSWebsocket();
  const [error, setError] = useState<string | undefined>(undefined);

  const onClick = useCallback(async () => {
    if (!socket) {
      return;
    }

    setError(undefined);
    try {
      await socket.call("SetInputSettings", {
        inputUuid: selectedFrame.inputUuid,
        inputSettings: {
          url,
          ...(selectedFrame.frameId !== frameId ? { width, height } : {}),
        },
      });

      if (name && name !== selectedFrame.inputName) {
        await socket.call("SetInputName", {
          inputUuid: selectedFrame.inputUuid,
          newInputName: name,
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update frame");
    }
  }, [socket, url, name, width, height, frameId, selectedFrame]);

  return (
    <>
      <Button variant="contained" onClick={onClick}>
        Save to Selected Frame
      </Button>
      {error && <p>{error}</p>}
    </>
  );
}
