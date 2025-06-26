import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TwitchState {
  accessToken?: string;
  expirationEpochTime?: number;
}

const twitchState = createSlice({
  name: "twitch",
  initialState: {} as TwitchState,
  reducers: {
    updateTwitchToken(
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
    },
    clearTwitchToken(state) {
      delete state.accessToken;
      delete state.expirationEpochTime;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateTwitchExpiration, (state, action) => {
      state.expirationEpochTime = action.payload.expirationEpochTime;
    });
  },
});

export const updateTwitchExpiration = createAction(
  "twitch/updateTwitchExpiration",
  (expiresIn: number) => {
    // Because of Redux state sync, all reducers must be absolutely pure. This needs
    // to be a separate action creator because of the usage of Date.now().
    return { payload: { expirationEpochTime: Date.now() + expiresIn * 1000 } };
  }
);

export const { updateTwitchToken, clearTwitchToken } = twitchState.actions;

export default twitchState.reducer;

export const twitchRootSelector = (state: RootState) => state.twitch;
