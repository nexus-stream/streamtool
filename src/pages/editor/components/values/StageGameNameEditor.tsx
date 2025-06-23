import { useStageValue } from "../../../../data/display/useStageValue";
import { css, TextField, ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useState } from "react";
import { size } from "../../../../style/theme";
import { STYLES } from "../../../../components/styles";
import { useTwitchApi } from "../../../../data/twitch/useTwitchApi";

interface Props {
  stageId: string;
}

export function StageGameNameEditor({ stageId }: Props) {
  const [backingValue, setBackingValue] = useStageValue(
    stageId,
    "streamGameName"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [gameId, setGameId] = useState("");
  const { getGameId } = useTwitchApi();

  const value = isEditing ? editValue : backingValue ?? "";

  const toggleIsEditing = useCallback(async () => {
    if (isEditing) {
      setBackingValue(editValue);
      setIsEditing(false);
      setGameId("Loading...");
      const gameId = await getGameId(editValue);
      if (!gameId) {
        setGameId("Invalid name");
      } else {
        setGameId(`Id: ${gameId}`);
      }
    } else {
      setEditValue(backingValue ?? "");
      setIsEditing(true);
    }
  }, [backingValue, editValue, getGameId, isEditing, setBackingValue]);

  return (
    <div css={containerStyle}>
      <TextField
        fullWidth
        value={value}
        size="small"
        label="Twitch Game Name"
        disabled={!isEditing}
        slotProps={{
          input: {
            readOnly: !isEditing,
          },
        }}
        onChange={(event) => setEditValue(event.target.value)}
      />
      <span>{gameId}</span>
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
