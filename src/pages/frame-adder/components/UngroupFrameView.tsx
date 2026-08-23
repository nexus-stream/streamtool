import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FRAMES } from "../../browser-source/frames";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { STYLES } from "../../../style/styles";
import { OBSConnectionWrapper } from "./OBSConnectionWrapper";
import {
  SceneFrame,
  resolveSceneFrame,
  ungroupSceneFrame,
} from "../groupFrames";

// The "Ungroup" tab. Listens for the user selecting a composite frame in OBS and expands it.
export function UngroupFrameView() {
  const socket = useOBSWebsocket();
  const [selectedFrame, setSelectedFrame] = useState<SceneFrame | undefined>(
    undefined
  );
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
        if (!isMounted) {
          return;
        }
        if (frame && frame.compositeConfig !== undefined) {
          setSelectedFrame(frame);
          setError(undefined);
        } else {
          setSelectedFrame(undefined);
        }
      } catch {
        if (isMounted) {
          setSelectedFrame(undefined);
        }
      }
    };

    const handleSceneChange = () => {
      if (isMounted) {
        setSelectedFrame(undefined);
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

  const onUngroup = useCallback(async () => {
    if (!socket || !selectedFrame) {
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await ungroupSceneFrame(socket, selectedFrame);
      setSelectedFrame(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to ungroup frame");
    } finally {
      setBusy(false);
    }
  }, [socket, selectedFrame]);

  return (
    <div css={STYLES.spacedColumn}>
      <OBSConnectionWrapper>
        {!selectedFrame ? (
          <p>Select a composite frame in OBS to ungroup it.</p>
        ) : (
          <div>
            <span>
              {selectedFrame.inputName} (
              {FRAMES[selectedFrame.frameId]?.displayProperties.displayName ??
                selectedFrame.frameId}
              )
            </span>
          </div>
        )}
        <div css={STYLES.spacedFlex}>
          <Button
            variant="contained"
            onClick={onUngroup}
            disabled={!selectedFrame || busy}
          >
            Ungroup
          </Button>
        </div>
        {error && <p>{error}</p>}
      </OBSConnectionWrapper>
    </div>
  );
}
