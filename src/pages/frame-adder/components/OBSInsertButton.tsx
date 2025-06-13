import { Button } from "@mui/material";
import { useCallback } from "react";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { useAppDispatch } from "../../../data/hooks";
import { obsInsertBrowserSource } from "../../../data/obs/tunnel/actions";

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
  const dispatch = useAppDispatch();

  const onClick = useCallback(async () => {
    dispatch(
      obsInsertBrowserSource({
        name:
          name ||
          `${frameName}_${uniqueNamesGenerator({
            dictionaries: [animals],
          })}`,
        url,
        width,
        height,
      })
    );
  }, [dispatch, frameName, height, name, url, width]);

  return (
    <Button variant="outlined" onClick={onClick}>
      Insert to Current Scene
    </Button>
  );
}
