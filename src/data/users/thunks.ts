import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "./api";
import { upsertUser } from "./userSlice";

export const addUserFromId = createAsyncThunk(
  "addUserFromId",
  async (userId: string, { dispatch }) => {
    const user = await getUser(userId);
    dispatch(upsertUser(user));
  }
);
