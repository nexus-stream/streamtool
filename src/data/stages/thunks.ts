import { createAsyncThunk } from "@reduxjs/toolkit";
import { Stage } from "./types";
import { v4 as uuidv4 } from "uuid";
import { addRaceFromId } from "../races/thunks";
import { upsertStage } from "./stageSlice";
import { setCurrentEditorStageId } from "../editor/editorSlice";

export const createStageForRace = createAsyncThunk(
  "createStageForRace",
  async ({ raceId, name }: { raceId: string; name: string }, { dispatch }) => {
    await dispatch(addRaceFromId(raceId)).unwrap();

    const stage: Stage = {
      id: uuidv4(),
      raceId,
      name,
      overrides: {
        participantOverrides: {},
      },
    };

    dispatch(upsertStage(stage));
    dispatch(setCurrentEditorStageId(stage.id));
  }
);
