import { useStageValue } from "../../../../data/stages/useStageValue";
import { css, TextField, ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useState } from "react";
import { size } from "../../../../style/theme";
import { STYLES } from "../../../../style/styles";
import { useTwitchApi } from "../../../../hooks/useTwitchApi";

interface Props {
  stageId: string;
}

// Twitch is very persnickety about how you send it what game you're streaming.
// Because it needs game titles to be exact ("Super Mario Bros" is invalid, it
// wants "Super Mario Bros."), we have a special input for the stage game
// that'll check if the game name is valid.
//
// This is a super gross hack that's just in here for now. Should be replaced with
// a modal that uses Twitch's search API to get suggestions when you type in a
// game name.
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
