import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useState, useCallback, ChangeEvent } from "react";
import { useAppDispatch } from "../../data/hooks";
import { createStageForRace } from "../../data/stages/thunks";
import { Button, Input } from "@mui/material";

export function EditorPage() {
  return <DebugStageAdder />;
}

function DebugStageAdder() {
  const [raceId, setRaceId] = useState("");
  const dispatch = useAppDispatch();

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRaceId(event.target.value);
  }, []);

  const onClick = useCallback(() => {
    dispatch(
      createStageForRace({
        raceId,
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
      })
    );
  }, [dispatch, raceId]);

  return (
    <div>
      <Input value={raceId} onChange={onChange} />
      <Button onClick={onClick}>Add</Button>
    </div>
  );
}
