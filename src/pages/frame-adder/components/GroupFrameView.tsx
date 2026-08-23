import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FRAMES } from "../../browser-source/frames";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { STYLES } from "../../../style/styles";
import { OBSConnectionWrapper } from "./OBSConnectionWrapper";
import {
  SceneFrame,
  groupSceneFrames,
  resolveSceneFrame,
  ungroupSceneFrame,
} from "../groupFrames";

// The "Group" tab. There is no reliable multi-select read in obs-websocket, so we
// accumulate the scene items the user clicks in OBS: each SceneItemSelected resolves
// to one of our frames and is added here, with a Remove button to prune mistakes.
// "Group" collapses the accumulated set; "Ungroup" expands a single selected composite.
export function GroupFrameView() {
  const socket = useOBSWebsocket();
  const [frames, setFrames] = useState<SceneFrame[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

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
        const frame = await resolveSceneFrame(socket, sceneUuid, sceneItemId);
        if (!frame) {
          return;
        }
        setFrames((prev) =>
          prev.some((f) => f.sceneItemId === frame.sceneItemId)
            ? prev
            : [...prev, frame]
        );
      } catch {
        // The item isn't one of our frames (or vanished mid-resolve); ignore it.
      }
    };

    socket.addListener("SceneItemSelected", handleSelected);
    return () => {
      socket.removeListener("SceneItemSelected", handleSelected);
    };
  }, [socket]);

  const removeFrame = (sceneItemId: number) => {
    setFrames((prev) => prev.filter((f) => f.sceneItemId !== sceneItemId));
  };

  const canGroup = frames.length >= 2;
  const canUngroup =
    frames.length === 1 && frames[0].compositeConfig !== undefined;

  const onGroup = useCallback(async () => {
    if (!socket || !canGroup) {
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await groupSceneFrames(socket, frames);
      setFrames([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to group frames");
    } finally {
      setBusy(false);
    }
  }, [socket, canGroup, frames]);

  const onUngroup = useCallback(async () => {
    if (!socket || !canUngroup) {
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await ungroupSceneFrame(socket, frames[0]);
      setFrames([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to ungroup frame");
    } finally {
      setBusy(false);
    }
  }, [socket, canUngroup, frames]);

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
        <div css={STYLES.spacedFlex}>
          <Button
            variant="contained"
            onClick={onGroup}
            disabled={!canGroup || busy}
          >
            Group
          </Button>
          <Button
            variant="contained"
            onClick={onUngroup}
            disabled={!canUngroup || busy}
          >
            Ungroup
          </Button>
        </div>
        {error && <p>{error}</p>}
      </OBSConnectionWrapper>
    </div>
  );
}
