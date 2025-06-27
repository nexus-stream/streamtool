import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TitleBar, VerticalContent } from "../../../components/Layout";
import { Avatar } from "../../../components/Avatar";
import { useCallback } from "react";
import { CommentatorValueEditor } from "./values/CommentatorValueEditor";
import { Commentator } from "../../../data/display/race/types";

interface Props {
  commentator: Commentator;
  onEdit: (newValue: Commentator) => void;
  onDelete: () => void;
}

// I slapped this together really quick. Might make more sense to move this out into
// a base stage rather than handling it as an override of a race.
export function CommentatorEditor({ commentator, onEdit, onDelete }: Props) {
  const patch = useCallback(
    <TParam extends keyof Commentator>(
      param: TParam,
      value: Commentator[TParam]
    ) => {
      onEdit({ ...commentator, [param]: value });
    },
    [commentator, onEdit]
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <TitleBar>
          <Avatar src={commentator.avatar} size="small" />
          <Typography component="span" alignContent="center">
            {commentator.user}
          </Typography>
        </TitleBar>
      </AccordionSummary>
      <AccordionDetails>
        <VerticalContent>
          <CommentatorValueEditor
            label="Name"
            value={commentator.user}
            onEdit={(newValue) => patch("user", newValue)}
          />
          <CommentatorValueEditor
            label="Pronouns"
            value={commentator.pronouns ?? ""}
            onEdit={(newValue) => patch("pronouns", newValue)}
          />
          <CommentatorValueEditor
            label="Avatar"
            value={commentator.avatar ?? ""}
            onEdit={(newValue) => patch("avatar", newValue)}
          />
          <Button variant="outlined" size="small" onClick={onDelete}>
            Delete
          </Button>
        </VerticalContent>
      </AccordionDetails>
    </Accordion>
  );
}
