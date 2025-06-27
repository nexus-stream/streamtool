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
import { OBSConnectionWrapper } from "./components/OBSConnectionWrapper";
import { OBSInsertButton } from "./components/OBSInsertButton";
import { Page } from "../../components/Layout";
import { STYLES } from "../../style/styles";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { FrameComponent } from "../browser-source/frame";
import qs from "qs";

// The page that generates URLs for the browser sources you can add to OBS with realtime
// data from the stream tool. Most of the crunchy parts of this process live in
// pages/browser-source, this just generates forms from the zod object attached to the
// frames and builds URLs that point to BrowserSourcePage with the frame's config.
export function FrameAdderPage() {
  const [frameId, setFrameId] = useState("");
  const [nameBase, setName] = useState("");
  const [frameParams, setFrameParams] = useState<object>({});

  const currentFrame: FrameComponent | undefined = FRAMES[frameId];
  const name =
    (nameBase || currentFrame?.displayProperties.defaultName?.(frameParams)) ??
    "";

  const onChange = useCallback((event: SelectChangeEvent) => {
    setFrameId(event.target.value);
    setName("");
    try {
      const startingParams = FRAMES[event.target.value].zodProps.parse({});
      setFrameParams(startingParams);
    } catch {
      setFrameParams({});
    }
  }, []);

  const overlayUrl = buildOBSOverlayURL(frameId, frameParams);

  return (
    <ObsWebSocketProvider>
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
              <hr />
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

              <OBSConnectionWrapper>
                <OBSInsertButton
                  url={overlayUrl}
                  frameName={currentFrame.displayProperties.displayName}
                  name={name}
                  width={currentFrame.displayProperties.width}
                  height={currentFrame.displayProperties.height}
                />
              </OBSConnectionWrapper>
            </>
          )}
        </FormControl>
      </Page>
    </ObsWebSocketProvider>
  );
}

function buildOBSOverlayURL(frameId: string, params: object): string {
  if (!frameId) {
    return "";
  }

  const origin = window.location.origin;

  const url = new URL(`/frame/${frameId}`, origin);
  return `${url.toString()}?${qs.stringify(params)}`;
}

const containerStyle = css`
  ${STYLES.spacedFlex};
  flex-direction: column;
`;
