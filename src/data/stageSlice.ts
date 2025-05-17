import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Participant, RaceInfo, RaceInfoOverrides, Stage } from "./types";
import { RootState } from "./store";

export const stagesAdapter = createEntityAdapter<Stage>();

const stagesSlice = createSlice({
  name: "stages",
  initialState: stagesAdapter.getInitialState({
    currentStageId: undefined as string | undefined,
  }),
  reducers: {
    setCurrentStageId(state, action: PayloadAction<string>) {
      state.currentStageId = action.payload;
    },
    clearCurrentStageId(state) {
      state.currentStageId = undefined;
    },
    addStage(state, action: PayloadAction<Stage>) {
      stagesAdapter.addOne(state, action.payload);
    },
    updateRaceInfo(
      state,
      action: PayloadAction<{ id: string; raceInfo: RaceInfo }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }
      stage.raceInfo = action.payload.raceInfo;
    },
    patchRaceInfoOverrides(
      state,
      action: PayloadAction<{ id: string; patch: Partial<RaceInfoOverrides> }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }
      stage.raceInfoOverrides = {
        ...stage.raceInfoOverrides,
        ...action.payload.patch,
      };
    },
    clearRaceInfoOverrideFields(
      state,
      action: PayloadAction<{
        id: string;
        fields: Array<keyof RaceInfoOverrides>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      for (const field of action.payload.fields) {
        delete stage.raceInfoOverrides[field];
      }
    },
    patchRaceInfoOverrideParticipant(
      state,
      action: PayloadAction<{
        id: string;
        user: string;
        patch: Partial<Participant>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      stage.raceInfoOverrides.participantPatches[action.payload.user] = {
        ...stage.raceInfoOverrides.participantPatches[action.payload.user],
        ...action.payload.patch,
      };
    },
    clearRaceInfoOverrideParticipantFields(
      state,
      action: PayloadAction<{
        id: string;
        user: string;
        fields: Array<keyof Participant>;
      }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage) {
        return;
      }

      for (const field of action.payload.fields) {
        delete stage.raceInfoOverrides.participantPatches[action.payload.user][
          field
        ];
      }
    },
  },
});

export const {
  setCurrentStageId,
  clearCurrentStageId,
  addStage,
  updateRaceInfo,
  patchRaceInfoOverrides,
  clearRaceInfoOverrideFields,
  patchRaceInfoOverrideParticipant,
  clearRaceInfoOverrideParticipantFields,
} = stagesSlice.actions;
export default stagesSlice.reducer;

export const stagesSelectors = stagesAdapter.getSelectors<RootState>(
  (state) => state.stages
);
