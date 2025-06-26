import { Stage } from "../../../../data/stages/types";
import {
  StringValuesOnly,
  useStageStringValue,
} from "../../../../data/stages/useStageValue";
import { css, TextField, ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useState } from "react";
import { size } from "../../../../style/theme";
import { STYLES } from "../../../../style/styles";

interface Props<
  TParam extends keyof StringValuesOnly<TStage>,
  TStage extends Stage
> {
  label: string;
  param: TParam;
  stageId: string;
}

export function StageValueEditor<
  TParam extends keyof StringValuesOnly<TStage>,
  TStage extends Stage
>({ label, param, stageId }: Props<TParam, TStage>) {
  const [backingValue, setBackingValue] = useStageStringValue(
    stageId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    param as any
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const value = isEditing ? editValue : backingValue ?? "";

  const toggleIsEditing = useCallback(() => {
    if (isEditing) {
      setBackingValue(editValue);
      setIsEditing(false);
    } else {
      setEditValue(backingValue);
      setIsEditing(true);
    }
  }, [backingValue, editValue, isEditing, setBackingValue]);

  return (
    <div css={containerStyle}>
      <TextField
        fullWidth
        value={value}
        size="small"
        label={label}
        disabled={!isEditing}
        slotProps={{
          input: {
            readOnly: !isEditing,
          },
        }}
        onChange={(event) => setEditValue(event.target.value)}
      />
      <ToggleButton
        size="small"
        value="check"
        selected={isEditing}
        onChange={toggleIsEditing}
      >
        {isEditing ? <SaveIcon /> : <EditIcon />}
      </ToggleButton>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  ${STYLES.fullWidth};
  gap: ${size(2)};
`;
