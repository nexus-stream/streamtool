import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../data/hooks";
import { selectPreviousStage } from "../../../../data/stages/selectors";
import { setCurrentStageId } from "../../../../data/stages/stageSlice";

export function PreviousStageButton() {
  const dispatch = useAppDispatch();
  const previousStage = useSelector(selectPreviousStage);

  const onClick = useCallback(() => {
    if (!previousStage?.id) {
      return;
    }

    dispatch(setCurrentStageId(previousStage?.id));
  }, [dispatch, previousStage?.id]);

  return (
    <Button
      css={buttonStyle}
      variant="outlined"
      size="small"
      onClick={onClick}
      disabled={!previousStage}
    >
      {previousStage ? `< ${previousStage.name}` : ""}
    </Button>
  );
}

const buttonStyle = css`
  flex-basis: 0;
  flex-grow: 1;
`;
