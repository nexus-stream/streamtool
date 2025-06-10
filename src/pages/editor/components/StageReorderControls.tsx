import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { size } from "../../../style/theme";
import { useAppDispatch } from "../../../data/hooks";
import { useCallback } from "react";
import { shiftStageIndex } from "../../../data/stages/stageSlice";

interface Props {
  stageId: string;
}

export function StageReorderControls({ stageId }: Props) {
  const dispatch = useAppDispatch();

  const shiftUp = useCallback(() => {
    dispatch(shiftStageIndex({ stageId, delta: -1 }));
  }, [dispatch, stageId]);

  const shiftDown = useCallback(() => {
    dispatch(shiftStageIndex({ stageId, delta: 1 }));
  }, [dispatch, stageId]);

  return (
    <div css={containerStyle}>
      <Button css={buttonStyle} onClick={shiftUp}>
        ↑
      </Button>
      <Button css={buttonStyle} onClick={shiftDown}>
        ↓
      </Button>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  width: ${size(6)};
  height: ${size(12)};
  justify-content: stretch;
`;

const buttonStyle = css`
  width: ${size(6)};
  min-width: ${size(6)};
  height: ${size(6)};
  font-size: ${size(3)};
`;
