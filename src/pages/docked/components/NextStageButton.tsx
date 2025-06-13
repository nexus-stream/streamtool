import { useSelector } from "react-redux";
import { selectNextStage } from "../../../data/stages/selectors";
import { Button, css } from "@mui/material";
import { useCallback } from "react";
import { useAppDispatch } from "../../../data/hooks";
import { setCurrentStageId } from "../../../data/stages/stageSlice";

export function NextStageButton() {
  const dispatch = useAppDispatch();
  const nextStage = useSelector(selectNextStage);

  const onClick = useCallback(() => {
    dispatch(setCurrentStageId(nextStage?.id));
  }, [dispatch, nextStage?.id]);

  if (!nextStage) {
    return null;
  }

  return (
    <Button css={buttonStyle} variant="outlined" size="small" onClick={onClick}>
      {nextStage.name} &gt;
    </Button>
  );
}

const buttonStyle = css`
  flex-basis: 0;
  flex-grow: 1;
`;
