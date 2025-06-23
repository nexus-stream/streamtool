import { Button } from "@mui/material";
import { useCallback } from "react";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { useOBSWebsocket } from "../../../data/obs/ObsWebSocketContext";
import { OBSWebSocketError } from "obs-websocket-js";

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

  const insertInput = useCallback(
    async (name: string, retryCount = 0) => {
      name = name || `${frameName}_${generateNameSuffix()}`;
      const sceneInfo = await obsSocket.call("GetSceneList");
      const sceneToInsertTo = sceneInfo.currentProgramSceneUuid;
      try {
        await obsSocket.call("CreateInput", {
          inputName: name,
          sceneUuid: sceneToInsertTo,
          inputKind: "browser_source",
          inputSettings: {
            url,
            width,
            height,
          },
        });
      } catch (e: unknown) {
        // Name is already in use
        if (
          e instanceof OBSWebSocketError &&
          e.code === 601 &&
          retryCount < 3
        ) {
          insertInput(`${name}_${generateNameSuffix()}`, retryCount + 1);
        }
      }
    },
    [frameName, height, obsSocket, url, width]
  );

  const onClick = useCallback(() => {
    insertInput(name);
  }, [insertInput, name]);

  return (
    <Button variant="outlined" onClick={onClick}>
      Insert to Current Scene
    </Button>
  );
}

function generateNameSuffix() {
  return uniqueNamesGenerator({
    dictionaries: [animals],
  });
}
