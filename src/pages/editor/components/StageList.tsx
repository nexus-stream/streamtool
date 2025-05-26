import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../data/hooks";
import { stageSelectors } from "../../../data/stages/selectors";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { setCurrentEditorStageId } from "../../../data/editor/editorSlice";
import { selectCurrentEditorStage } from "../../../data/editor/selectors";
import { ReactNode, useEffect, useState } from "react";
import { StageDeleteModal } from "./StageDeleteModal";
import { StageCreateModal } from "./StageCreateModal";

export function StageList() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useAppDispatch();
  const stages = useSelector(stageSelectors.selectAll);
  const currentEditorStage = useSelector(selectCurrentEditorStage);

  useEffect(() => {
    if (!currentEditorStage) {
      dispatch(setCurrentEditorStageId(stages[0]?.id));
    }
  }, [currentEditorStage, dispatch, stages]);

  return (
    <div className="w-76 shrink-0 bg-neutral-800 rounded-md h-full pt-4 pb-4 overflow-y-auto ">
      <List component={TestComponent}>
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
            </ListItem>
          );
        })}

        <ListItem className="mt-auto" disablePadding>
          {currentEditorStage && (
            <ListItemButton
              component="a"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <ListItemText className="text-center" primary="Delete" />
            </ListItemButton>
          )}
          <ListItemButton
            component="a"
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <ListItemText className="text-center" primary="Create" />
          </ListItemButton>
        </ListItem>
      </List>

      {isCreating && <StageCreateModal onClose={() => setIsCreating(false)} />}
      {isDeleting && <StageDeleteModal onClose={() => setIsDeleting(false)} />}
    </div>
  );
}

function TestComponent({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col h-full">{children}</ul>;
}
