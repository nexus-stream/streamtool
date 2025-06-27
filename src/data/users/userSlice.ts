import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "./types";

export const userAdapter = createEntityAdapter({
  selectId: (user: User) => user.user,
});

// Contains raw data from TheRun. This should never be directly used anywhere in the
// app - any data you need should be incorporated into DisplayRace / DisplayParticipant
// instead.
const userSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState(),
  reducers: {
    upsertUser(state, action: PayloadAction<User>) {
      userAdapter.upsertOne(state, action.payload);
    },
  },
});

export const { upsertUser } = userSlice.actions;
export default userSlice.reducer;

export const userRootSelector = (state: RootState) => state.users;
