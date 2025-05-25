import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { FRAMES } from "../browser-source/frames";
import { FrameParamControls } from "./components/FrameParamControls";
import { useSearchParams } from "react-router";
import { OBSConnectionWrapper } from "./components/OBSConnectionWrapper";
import { OBSInsertButton } from "./components/OBSInsertButton";

// This page is loaded from a separate origin in production. All pages that communicate with
// outside services like therun need to be hosted on https, while anything that needs to
// communicate with OBS's websocket server (like this page) needs to be hosted on http.
// That means you should not expect any of the data that gets shared between other pages will
// be available here.
export function FrameAdderPage() {
  const [frameId, setFrameId] = useState("");
  const [name, setName] = useState("");
  const [frameParams, setFrameParams] = useState<object>({});
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin");

  const currentFrame = FRAMES[frameId];

  const onChange = useCallback((event: SelectChangeEvent) => {
    setFrameId(event.target.value);
    try {
      const startingParams = FRAMES[event.target.value].zodProps.parse({});
      setFrameParams(startingParams);
    } catch {
      setFrameParams({});
    }
  }, []);

  return (
    <FormControl fullWidth className="flex flex-col gap-8">
      <InputLabel id="frame-id-select-label">Frame</InputLabel>
      <Select
        labelId="frame-id-select-label"
        id="frame-id-select"
        value={frameId}
        label="Frame"
        onChange={onChange}
      >
        {Object.entries(FRAMES).map(([id, frame]) => (
          <MenuItem key={id} value={id}>
            {frame.displayProperties.displayName}
          </MenuItem>
        ))}
      </Select>
      {currentFrame && (
        <>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FrameParamControls
            schema={currentFrame.zodProps}
            params={frameParams}
            setParams={setFrameParams}
          />
          <OBSConnectionWrapper>
            <OBSInsertButton
              url={buildOBSOverlayURL(
                frameId,
                frameParams,
                origin ?? undefined
              )}
              name={name}
              width={currentFrame.displayProperties.width}
              height={currentFrame.displayProperties.height}
            />
          </OBSConnectionWrapper>
        </>
      )}
    </FormControl>
  );
}

function buildOBSOverlayURL(
  frameId: string,
  params: object,
  originOverride?: string
): string {
  if (!frameId) {
    return "";
  }

  const url = new URL(
    `/frame/${frameId}`,
    originOverride ?? window.location.origin
  );
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}
