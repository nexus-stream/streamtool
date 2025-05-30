import { Button } from "@mui/material";
import { ModalButtons, StyledModal } from "../../../components/StyledModal";
import { useSelector } from "react-redux";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { useAppDispatch } from "../../../data/hooks";
import { useCallback } from "react";
import { removeStage } from "../../../data/stages/stageSlice";

interface Props {
  onClose: () => void;
}

export function StageDeleteModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  const onConfirm = useCallback(() => {
    if (!currentEditorStage) {
      return;
    }

    dispatch(removeStage(currentEditorStage.id));
    onClose();
  }, [currentEditorStage, dispatch, onClose]);

  if (!currentEditorStage) {
    return null;
  }

  return (
    <StyledModal onClose={onClose}>
      <h2>Delete stage "{currentEditorStage.name}"?</h2>
      <ModalButtons>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </ModalButtons>
    </StyledModal>
  );
}
