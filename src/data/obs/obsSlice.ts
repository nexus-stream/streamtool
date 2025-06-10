import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ObsState {
  port: string;
  password: string;
  loginTime: number;
}

const obsSlice = createSlice({
  name: "obs",
  initialState: {
    port: "4455",
    password: "",
    loginTime: 0,
  } as ObsState,
  reducers: {
    updateObsCredentials(
      state,
      action: PayloadAction<{
        port: string;
        password: string;
        loginTime: number;
      }>
    ) {
      state.port = action.payload.port;
      state.password = action.payload.password;
      state.loginTime = action.payload.loginTime;
    },
  },
});

// Normally we'd handle this in the reducer function, but because we're using redux-state-sync
// we need to keep reducer functions absolutely pure.
export const loginToObs = createAsyncThunk(
  "loginToObs",
  async (
    { port, password }: { port: string; password: string },
    { dispatch }
  ) => {
    const loginTime = Date.now();

    dispatch(
      obsSlice.actions.updateObsCredentials({ port, password, loginTime })
    );
  }
);

export default obsSlice.reducer;

export const obsRootSelector = (state: RootState) => state.obs;
