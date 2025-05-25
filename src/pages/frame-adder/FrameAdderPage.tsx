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

export function FrameAdderPage() {
  const [frameId, setFrameId] = useState("");
  const [frameParams, setFrameParams] = useState<object>({});

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
          <FrameParamControls
            schema={currentFrame.zodProps}
            params={frameParams}
            setParams={setFrameParams}
          />
          <TextField
            label="OBS Overlay URL"
            value={buildOBSOverlayURL(frameId, frameParams)}
          />
          <TextField
            label="width"
            value={currentFrame.displayProperties.width}
          />
          <TextField
            label="height"
            value={currentFrame.displayProperties.height}
          />
        </>
      )}
    </FormControl>
  );
}

function buildOBSOverlayURL(frameId: string, params: object): string {
  if (!frameId) {
    return "";
  }

  const url = new URL(`/frame/${frameId}`, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}

// Form to select frame type
// Form controls for each item in params
