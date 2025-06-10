import { Button } from "@mui/material";
import { useCallback } from "react";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";

interface Props {
  url: string;
  frameName: string;
  name: string;
  width: number;
  height: number;
}

export function OBSInsertButton({
  url,
  frameName,
  name,
  width,
  height,
}: Props) {
  const obsSocket = useOBSWebsocket();

  const onClick = useCallback(async () => {
    const sceneInfo = await obsSocket.call("GetSceneList");
    const sceneToInsertTo =
      sceneInfo.currentPreviewSceneUuid || sceneInfo.currentProgramSceneUuid;
    await obsSocket.call("CreateInput", {
      inputName:
        name ||
        `${frameName}_${uniqueNamesGenerator({
          dictionaries: [animals],
        })}`,
      sceneUuid: sceneToInsertTo,
      inputKind: "browser_source",
      inputSettings: {
        url,
        width,
        height,
      },
    });
  }, [frameName, height, name, obsSocket, url, width]);

  return (
    <Button variant="outlined" onClick={onClick}>
      Insert to Current Scene
    </Button>
  );
}
