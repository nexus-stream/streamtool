import { Button, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FRAMES } from "../../browser-source/frames";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { STYLES } from "../../../style/styles";
import { OBSConnectionWrapper } from "./OBSConnectionWrapper";
import {
  SceneFrame,
  groupSceneFrames,
  resolveSceneFrame,
} from "../groupFrames";

// The "Group" tab. There is no reliable multi-select read in obs-websocket, so we
// accumulate the scene items the user clicks in OBS: each SceneItemSelected resolves
// to one of our frames and is added here, with a Remove button to prune mistakes.
// "Group" collapses the accumulated set into a composite frame.
export function GroupFrameView() {
  const socket = useOBSWebsocket();
  const [frames, setFrames] = useState<SceneFrame[]>([]);
  const [name, setName] = useState("Group");
  const [error, setError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!socket) {
      return;
    }

    let isMounted = true;

    const handleSelected = async ({
      sceneUuid,
      sceneItemId,
    }: {
      sceneUuid: string;
      sceneItemId: number;
    }) => {
      try {
        const frame = await resolveSceneFrame(socket, sceneUuid, sceneItemId);
        if (!frame || !isMounted || frame.compositeConfig !== undefined) {
          return;
        }
        setFrames((prev) => {
          if (prev.length > 0 && prev[0].sceneUuid !== frame.sceneUuid) {
            return [frame];
          }
          return prev.some((f) => f.sceneItemId === frame.sceneItemId)
            ? prev
            : [...prev, frame];
        });
      } catch {
        // The item isn't one of our frames (or vanished mid-resolve); ignore it.
      }
    };

    const handleSceneChange = () => {
      if (isMounted) {
        setFrames([]);
      }
    };

    socket.addListener("SceneItemSelected", handleSelected);
    socket.addListener("CurrentProgramSceneChanged", handleSceneChange);
    return () => {
      isMounted = false;
      socket.removeListener("SceneItemSelected", handleSelected);
      socket.removeListener("CurrentProgramSceneChanged", handleSceneChange);
    };
  }, [socket]);
  const removeFrame = (sceneItemId: number) => {
    setFrames((prev) => prev.filter((f) => f.sceneItemId !== sceneItemId));
  };

  const canGroup = frames.length >= 2;
  const onGroup = useCallback(async () => {
    if (!socket || !canGroup) {
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await groupSceneFrames(socket, frames, name);
      setFrames([]);
      setName("Group");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to group frames");
    } finally {
      setBusy(false);
    }
  }, [socket, canGroup, frames, name]);

  const onClear = useCallback(() => {
    setFrames([]);
    setName("Group");
    setError(undefined);
  }, []);

  return (
    <div css={STYLES.spacedColumn}>
      <OBSConnectionWrapper>
        {frames.length === 0 ? (
          <p>Select frames in OBS to add them to the group.</p>
        ) : (
          frames.map((frame) => (
            <div key={frame.sceneItemId} css={STYLES.spacedFlex}>
              <span>
                {frame.inputName} (
                {FRAMES[frame.frameId]?.displayProperties.displayName ??
                  frame.frameId}
                )
              </span>
              <Button
                size="small"
                onClick={() => removeFrame(frame.sceneItemId)}
              >
                Remove
              </Button>
            </div>
          ))
        )}
        {canGroup && (
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}
        <div css={STYLES.spacedFlex}>
          <Button
            variant="contained"
            onClick={onGroup}
            disabled={!canGroup || busy}
          >
            Group
          </Button>
          <Button
            variant="outlined"
            onClick={onClear}
            disabled={frames.length === 0 || busy}
          >
            Clear
          </Button>
        </div>
        {error && <p>{error}</p>}
      </OBSConnectionWrapper>
    </div>
  );
}
