import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  css,
} from "@mui/material";
import { useCallback, useState } from "react";
import { FRAMES } from "../browser-source/frames";
import { FrameParamControls } from "./components/FrameParamControls";
import { OBSInsertButton } from "./components/OBSInsertButton";
import { Page } from "../../components/Layout";
import { STYLES } from "../../components/styles";

export function FrameAdderPage() {
  const [frameId, setFrameId] = useState("");
  const [name, setName] = useState("");
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

  const overlayUrl = buildOBSOverlayURL(frameId, frameParams);

  return (
    <Page>
      <FormControl fullWidth css={containerStyle}>
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
            <Button variant="outlined" href={overlayUrl} target="_blank">
              Preview Frame
            </Button>

            <OBSInsertButton
              url={overlayUrl}
              frameName={currentFrame.displayProperties.displayName}
              name={name}
              width={currentFrame.displayProperties.width}
              height={currentFrame.displayProperties.height}
            />
          </>
        )}
      </FormControl>
    </Page>
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

const containerStyle = css`
  ${STYLES.spacedFlex};
  flex-direction: column;
`;
