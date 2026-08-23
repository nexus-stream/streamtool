import { Button } from "@mui/material";
import { useState } from "react";
import { FRAMES } from "../../browser-source/frames";
import { buildOBSOverlayURL } from "../../browser-source/overlayUrl";
import { STYLES } from "../../../style/styles";
import { FrameConfigForm } from "./FrameConfigForm";
import { OBSConnectionWrapper } from "./OBSConnectionWrapper";
import { OBSInsertButton } from "./OBSInsertButton";

// Configures and inserts a brand new frame into the current scene.
export function AddFrameView() {
  const [frameId, setFrameId] = useState("");
  const [nameBase, setName] = useState("");
  const [frameParams, setFrameParams] = useState<object>({});

  const currentFrame = FRAMES[frameId];
  const name =
    (nameBase || currentFrame?.displayProperties.defaultName?.(frameParams)) ??
    "";
  const overlayUrl = buildOBSOverlayURL(frameId, frameParams);

  const controls = currentFrame && (
    <>
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
  );

  return (
    <div css={STYLES.spacedColumn}>
      {controls}
      <FrameConfigForm
        frameId={frameId}
        setFrameId={setFrameId}
        name={name}
        setName={setName}
        frameParams={frameParams}
        setFrameParams={setFrameParams}
      />
      {controls}
    </div>
  );
}
