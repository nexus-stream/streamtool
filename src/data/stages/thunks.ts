import { createAsyncThunk } from "@reduxjs/toolkit";
import { Stage } from "./types";
import { v4 as uuidv4 } from "uuid";
import { addRaceFromId } from "../races/thunks";
import { setStage } from "./stageSlice";
import { setCurrentEditorStageId } from "../editor/editorSlice";

export const createStageForRace = createAsyncThunk(
  "createStageForRace",
  async ({ raceId, name }: { raceId: string; name: string }, { dispatch }) => {
    await dispatch(addRaceFromId(raceId)).unwrap();

    const stage: Stage = {
      id: uuidv4(),
      raceId,
      name,
      kind: "race",
      raceOverrides: {},
      participantOverrides: {},
    };

    dispatch(setStage(stage));
    dispatch(setCurrentEditorStageId(stage.id));
  }
);

export const createStageForVod = createAsyncThunk(
  "createStageForVod",
  async ({ vodId, name }: { vodId: string; name: string }, { dispatch }) => {
    const stage: Stage = {
      // This has to be a thunk because uuid generation makes it an impure function and thus
      // incompatible with redux state sync. I suppose I could just create an action and handle
      // it in the action creator, but I'm feeling lazy right now.
      id: uuidv4(),
      vodId,
      name,
      kind: "vod",
    };

    dispatch(setStage(stage));
  }
);
