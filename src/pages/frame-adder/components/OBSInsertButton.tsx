import { Button } from "@mui/material";
import { useOBSWebsocket } from "./OBSWebSocketContext";
import { useCallback } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

interface Props {
  url: string;
  name: string;
  width: number;
  height: number;
}

export function OBSInsertButton({ url, name, width, height }: Props) {
  const obsSocket = useOBSWebsocket();

  const onClick = useCallback(async () => {
    const sceneInfo = await obsSocket.call("GetSceneList");
    const sceneToInsertTo =
      sceneInfo.currentPreviewSceneUuid || sceneInfo.currentProgramSceneUuid;
    await obsSocket.call("CreateInput", {
      inputName:
        name ||
        uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
      sceneUuid: sceneToInsertTo,
      inputKind: "browser_source",
      inputSettings: {
        url,
        width,
        height,
      },
    });
  }, [height, name, obsSocket, url, width]);

  return <Button onClick={onClick}>Insert to Current Scene</Button>;
}
