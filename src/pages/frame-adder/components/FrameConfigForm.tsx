import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { FRAMES } from "../../browser-source/frames";
import { FrameParamControls } from "./FrameParamControls";

interface Props {
  frameId: string;
  setFrameId: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  frameParams: object;
  setFrameParams: React.Dispatch<React.SetStateAction<object>>;
}

// The frame picker, name field, and generated param controls. Shared by the add and
// edit views. Switching frame type resets the name and params to the new frame's
// defaults, since the old values no longer apply.
export function FrameConfigForm({
  frameId,
  setFrameId,
  name,
  setName,
  frameParams,
  setFrameParams,
}: Props) {
  const currentFrame = FRAMES[frameId];

  const onChangeFrame = (event: SelectChangeEvent) => {
    setFrameId(event.target.value);
    setName("");
    try {
      setFrameParams(FRAMES[event.target.value].zodProps.parse({}));
    } catch {
      setFrameParams({});
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="frame-id-select-label">Frame</InputLabel>
        <Select
          labelId="frame-id-select-label"
          id="frame-id-select"
          value={frameId}
          label="Frame"
          onChange={onChangeFrame}
        >
          {Object.entries(FRAMES).map(([id, frame]) => (
            <MenuItem key={id} value={id}>
              {frame.displayProperties.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
        </>
      )}
    </>
  );
}
