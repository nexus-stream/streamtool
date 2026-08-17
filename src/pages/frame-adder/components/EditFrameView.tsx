import { Button, css } from "@mui/material";
import { useCallback, useState } from "react";
import { FRAMES } from "../../browser-source/frames";
import { buildOBSOverlayURL } from "../../browser-source/overlayUrl";
import { STYLES } from "../../../style/styles";
import { FrameConfigForm } from "./FrameConfigForm";
import { FrameSelectListener, LoadedFrame } from "./FrameSelectListener";
import { OBSConnectionWrapper } from "./OBSConnectionWrapper";
import { OBSUpdateButton } from "./OBSUpdateButton";

// Edits an existing frame: selecting a frame in OBS populates the form, and Save
// overwrites that source with the form's current config.
export function EditFrameView() {
  const [frameId, setFrameId] = useState("");
  const [nameBase, setName] = useState("");
  const [frameParams, setFrameParams] = useState<object>({});
  const [selectedFrame, setSelectedFrame] = useState<LoadedFrame | undefined>(
    undefined
  );

  const currentFrame = FRAMES[frameId];
  const name =
    (nameBase || currentFrame?.displayProperties.defaultName?.(frameParams)) ??
    "";
  const overlayUrl = buildOBSOverlayURL(frameId, frameParams);

  const handleSelect = useCallback((frame: LoadedFrame | undefined) => {
    if (!frame) {
      setSelectedFrame(undefined);
      return;
    }

    setFrameId(frame.frameId);
    setFrameParams(frame.params);
    setName(frame.inputName);
    setSelectedFrame(frame);
  }, []);

  return (
    <div css={containerStyle}>
      <FrameSelectListener onSelect={handleSelect} />
      <FrameConfigForm
        frameId={frameId}
        setFrameId={setFrameId}
        name={name}
        setName={setName}
        frameParams={frameParams}
        setFrameParams={setFrameParams}
      />
      {currentFrame && (
        <Button variant="outlined" href={overlayUrl} target="_blank">
          Preview Frame
        </Button>
      )}
      <OBSConnectionWrapper>
        {selectedFrame && currentFrame ? (
          <OBSUpdateButton
            url={overlayUrl}
            name={name}
            width={currentFrame.displayProperties.width}
            height={currentFrame.displayProperties.height}
            frameId={frameId}
            selectedFrame={selectedFrame}
          />
        ) : (
          <p>Select a frame in OBS to edit it here.</p>
        )}
      </OBSConnectionWrapper>
    </div>
  );
}

const containerStyle = css`
  ${STYLES.spacedFlex};
  flex-direction: column;
`;
