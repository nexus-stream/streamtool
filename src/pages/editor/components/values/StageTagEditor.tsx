import { useCallback, useEffect, useState } from "react";
import { useStageValue } from "../../../../data/display/useStageValue";
import { css } from "@emotion/react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { size } from "../../../../style/theme";
import { useSelector } from "react-redux";
import { selectAllStageTagNames } from "../../../../data/stages/selectors";

interface Props {
  stageId: string;
}

export function StageTagEditor({ stageId }: Props) {
  const [tags, setTags] = useStageValue(stageId, "tags");
  const [editorTags, setEditorTags] = useState<Array<[string, string]>>([]);

  useEffect(() => {
    setEditorTags((oldEditorTags) => {
      const backingTags = { ...tags };
      for (const [key] of oldEditorTags) {
        delete backingTags[key];
      }

      const newBackingTags = Object.entries(backingTags);
      if (newBackingTags.length === 0) {
        return oldEditorTags;
      }

      return [...oldEditorTags, ...newBackingTags];
    });
  }, [tags]);

  useEffect(() => {
    const newTags: { [key: string]: string } = {};
    for (const [key, value] of editorTags) {
      if (key) {
        newTags[key] = value;
      }
    }
    setTags(newTags);
  }, [editorTags, setTags]);

  const updateTag = useCallback((index: number, key: string, value: string) => {
    setEditorTags((old) => {
      const newTags = [...old];
      newTags[index] = [key, value];
      return newTags;
    });
  }, []);

  const addTag = useCallback(() => {
    setEditorTags((old) => {
      return [...old, ["", ""]];
    });
  }, []);

  const deleteTag = useCallback((index: number) => {
    setEditorTags((old) => {
      const newTags = [...old];
      newTags.splice(index, 1);
      return newTags;
    });
  }, []);

  return (
    <div css={containerStyle}>
      <h2>Tags</h2>
      {editorTags.map(([name, value], index) => {
        return (
          <SingleTagEditor
            key={index}
            name={name}
            value={value}
            index={index}
            updateTag={updateTag}
            deleteTag={deleteTag}
          />
        );
      })}
      <Button
        css={addButtonStyle}
        variant="outlined"
        size="small"
        onClick={addTag}
      >
        Add
      </Button>
    </div>
  );
}

function SingleTagEditor({
  name,
  value,
  index,
  updateTag,
  deleteTag,
}: {
  name: string;
  value: string;
  index: number;
  updateTag: (index: number, key: string, value: string) => void;
  deleteTag: (index: number) => void;
}) {
  const tagNames = useSelector(selectAllStageTagNames);

  return (
    <div css={rowStyle}>
      <Autocomplete
        fullWidth
        freeSolo
        autoSelect
        options={tagNames}
        value={name}
        onChange={(_, name) => updateTag(index, name ?? "", value)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderInput={(params: any) => (
          <TextField {...params} size="small" label="Name" />
        )}
      />

      <TextField
        fullWidth
        value={value}
        size="small"
        label="Value"
        onChange={(event) => updateTag(index, name, event.target.value)}
      />
      <Button variant="outlined" size="small" onClick={() => deleteTag(index)}>
        X
      </Button>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: ${size(4)};
`;

const rowStyle = css`
  display: flex;
  gap: ${size(2)};
`;

const addButtonStyle = css`
  /* margin-top: ${size(4)}; */
`;
