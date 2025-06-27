import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { Stage } from "./types";
import { RootState } from "../store";
import { DisplayRace } from "../display/race/types";
import { DisplayParticipant } from "../display/participant/types";

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
    setStage(state, action: PayloadAction<Stage>) {
      stageAdapter.setOne(state, action.payload);
    },
    updateStage(state, action: PayloadAction<Update<Stage, string>>) {
      stageAdapter.updateOne(state, action.payload);
    },
    removeStage(state, action: PayloadAction<string>) {
      stageAdapter.removeOne(state, action.payload);
    },
    shiftStageIndex(
      state,
      {
        payload: { stageId, delta },
      }: PayloadAction<{ stageId: string; delta: number }>
    ) {
      const currentIndex = state.ids.indexOf(stageId);
      if (currentIndex === -1) {
        return;
      }

      const newIndex = Math.min(
        Math.max(currentIndex + delta, 0),
        state.ids.length - 1
      );

      state.ids.splice(currentIndex, 1);
      state.ids.splice(newIndex, 0, stageId);
    },
    setParticipantOrder(
      state,
      action: PayloadAction<{ id: string; participantOrder: string[] }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage || stage.kind !== "race") {
        return;
      }

      stage.participantOrder = action.payload.participantOrder;
    },
    patchRaceOverrides(
      state,
      action: PayloadAction<{ id: string; patch: Partial<DisplayRace> }>
    ) {
      const stage = state.entities[action.payload.id];
      if (!stage || stage.kind !== "race") {
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
      if (!stage || stage.kind !== "race") {
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
  setStage,
  updateStage,
  removeStage,
  shiftStageIndex,
  setParticipantOrder,
  patchRaceOverrides,
  patchRaceOverrideParticipant,
} = stageSlice.actions;
export default stageSlice.reducer;

export const stageRootSelector = (state: RootState) => state.stages;
