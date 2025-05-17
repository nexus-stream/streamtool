import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRaceInfo } from "../therun/api";
import { Stage } from "./types";
import { v4 as uuidv4 } from "uuid";
import { addStage } from "./stageSlice";

export const addStageFromRaceId = createAsyncThunk(
  "addStageWithRaceId",
  async ({ raceId, name }: { raceId: string; name: string }, thunkAPI) => {
    const raceInfo = await getRaceInfo(raceId);

    const stage: Stage = {
      id: uuidv4(),
      raceId,
      name,
      raceInfo,
      raceInfoOverrides: {
        participantPatches: {},
      },
    };

    thunkAPI.dispatch(addStage(stage));
  }
);
