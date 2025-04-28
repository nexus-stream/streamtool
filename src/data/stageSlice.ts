import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Stage } from "./types";
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
  },
});

export const { setCurrentStageId, clearCurrentStageId } = stagesSlice.actions;
export default stagesSlice.reducer;

export const stagesSelectors = stagesAdapter.getSelectors<RootState>(
  (state) => state.stages
);
