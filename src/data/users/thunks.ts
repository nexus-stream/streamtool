import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "./api";
import { upsertUser } from "./userSlice";

// Retrieve a user from therun and dispatch it to Redux.
export const addUserFromId = createAsyncThunk(
  "addUserFromId",
  async (userId: string, { dispatch }) => {
    const user = await getUser(userId);
    dispatch(upsertUser(user));
  }
);
