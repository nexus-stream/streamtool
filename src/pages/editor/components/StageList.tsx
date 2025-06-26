import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../data/hooks";
import {
  selectCurrentStageId,
  stageSelectors,
} from "../../../data/stages/selectors";
import {
  css,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { setCurrentEditorStageId } from "../../../data/editor/editorSlice";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { useEffect, useState } from "react";
import { StageDeleteModal } from "./StageDeleteModal";
import { StageCreateModal } from "./StageCreateModal";
import { COLORS, SIZES } from "../../../style/theme";
import { STYLES } from "../../../style/styles";
import { StageReorderControls } from "./StageReorderControls";

export function StageList() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useAppDispatch();
  const stages = useSelector(stageSelectors.selectAll);
  const currentEditorStage = useSelector(selectCurrentEditorStage);
  const activeStageId = useSelector(selectCurrentStageId);

  useEffect(() => {
    if (!currentEditorStage) {
      dispatch(setCurrentEditorStageId(activeStageId));
    }
  }, [activeStageId, currentEditorStage, dispatch]);

  return (
    <div css={containerStyle}>
      <List css={listStyle}>
        {stages.map((stage) => {
          return (
            <ListItem key={stage.id} disablePadding>
              <ListItemButton
                component="a"
                selected={stage === currentEditorStage}
                onClick={() => {
                  dispatch(setCurrentEditorStageId(stage.id));
                }}
              >
                <ListItemText primary={stage.name} />
              </ListItemButton>
              <StageReorderControls stageId={stage.id} />
            </ListItem>
          );
        })}

        <ListItem css={listControlsStyle} disablePadding>
          {currentEditorStage && (
            <ListItemButton
              component="a"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <ListItemText css={listControlTextStyle} primary="Delete" />
            </ListItemButton>
          )}
          <ListItemButton
            component="a"
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <ListItemText css={listControlTextStyle} primary="Create" />
          </ListItemButton>
        </ListItem>
      </List>

      {isCreating && <StageCreateModal onClose={() => setIsCreating(false)} />}
      {isDeleting && <StageDeleteModal onClose={() => setIsDeleting(false)} />}
    </div>
  );
}

const containerStyle = css`
  ${STYLES.fullHeight};
  ${STYLES.roundedCorners};
  width: ${SIZES.lg};
  flex-shrink: 0;
  background-color: ${COLORS.bgLight};
  overflow-y: auto;
`;

const listStyle = css`
  ${STYLES.fullHeight};
  display: flex;
  flex-direction: column;
`;

const listControlsStyle = css`
  margin-top: auto;
`;

const listControlTextStyle = css`
  text-align: center;
`;
