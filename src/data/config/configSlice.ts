import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ConfigState {
  isAdmin: boolean;
  isTwitchSyncEnabled: boolean;
}

const configSlice = createSlice({
  name: "config",
  initialState: { isAdmin: true, isTwitchSyncEnabled: false } as ConfigState,
  reducers: {
    toggleIsAdmin(state) {
      state.isAdmin = !state.isAdmin;
    },
    setIsTwitchSyncEnabled(state, action: PayloadAction<boolean>) {
      state.isTwitchSyncEnabled = action.payload;
    },
  },
});

export const { toggleIsAdmin, setIsTwitchSyncEnabled } = configSlice.actions;
export default configSlice.reducer;

export const configRootSelector = (state: RootState) => state.config;
