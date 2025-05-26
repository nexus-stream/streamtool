import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Stage } from "./types";
import { RootState } from "../store";
import { DisplayRace, DisplayParticipant } from "../display/types";

export const stageAdapter = createEntityAdapter<Stage>();

const stageSlice = createSlice({
  name: "stages",
  initialState: stageAdapter.getInitialState({
    currentStageId: undefined as string | undefined,
  }),
  reducers: {
    setCurrentStageId(state, action: PayloadAction<string | undefined>) {
      state.currentStageId = action.payload;
    },
    upsertStage(state, action: PayloadAction<Stage>) {
      stageAdapter.upsertOne(state, action.payload);
    },
    removeStage(state, action: PayloadAction<string>) {
      stageAdapter.removeOne(state, action.payload);
    },
    patchRaceOverrides(
      state,
      action: PayloadAction<{ id: string; patch: Partial<DisplayRace> }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }
      stage.raceOverrides = {
        ...stage.raceOverrides,
        ...action.payload.patch,
      };

      for (const [key, value] of Object.entries(stage.raceOverrides)) {
        if (value === undefined) {
          delete stage.raceOverrides[key as keyof DisplayRace];
        }
      }
    },
    patchRaceOverrideParticipant(
      state,
      action: PayloadAction<{
        id: string;
        user: string;
        patch: Partial<DisplayParticipant>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      stage.participantOverrides[action.payload.user] = {
        ...stage.participantOverrides[action.payload.user],
        ...action.payload.patch,
      };

      for (const [key, value] of Object.entries(
        stage.participantOverrides[action.payload.user]
      )) {
        if (value === undefined) {
          delete stage.participantOverrides[action.payload.user][
            key as keyof DisplayParticipant
          ];
        }
      }
    },
  },
});

export const {
  setCurrentStageId,
  upsertStage,
  removeStage,
  patchRaceOverrides,
  patchRaceOverrideParticipant,
} = stageSlice.actions;
export default stageSlice.reducer;

export const stageRootSelector = (state: RootState) => state.stages;
