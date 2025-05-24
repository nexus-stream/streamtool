import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { DisplayParticipant, RaceOverrides, Stage } from "./types";
import { RootState } from "../store";

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
      action: PayloadAction<{ id: string; patch: Partial<RaceOverrides> }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }
      stage.overrides = {
        ...stage.overrides,
        ...action.payload.patch,
      };
    },
    clearRaceOverrideFields(
      state,
      action: PayloadAction<{
        id: string;
        fields: Array<keyof RaceOverrides>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      for (const field of action.payload.fields) {
        delete stage.overrides[field];
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

      stage.overrides.participantOverrides[action.payload.user] = {
        ...stage.overrides.participantOverrides[action.payload.user],
        ...action.payload.patch,
      };
    },
    clearRaceOverrideParticipantFields(
      state,
      action: PayloadAction<{
        id: string;
        user: string;
        fields: Array<keyof DisplayParticipant>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      for (const field of action.payload.fields) {
        delete stage.overrides.participantOverrides[action.payload.user][field];
      }
    },
  },
});

export const {
  setCurrentStageId,
  upsertStage,
  patchRaceOverrides,
  clearRaceOverrideFields,
  patchRaceOverrideParticipant,
  clearRaceOverrideParticipantFields,
} = stageSlice.actions;
export default stageSlice.reducer;

export const stageRootSelector = (state: RootState) => state.stages;
