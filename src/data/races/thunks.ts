import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRace } from "./api";
import { upsertRace } from "./raceSlice";
import { addUserFromId } from "../users/thunks";

export const addRaceFromId = createAsyncThunk(
  "addRaceFromId",
  async (raceId: string, { dispatch }) => {
    const race = await getRace(raceId);
    dispatch(upsertRace(race));

    const userIds =
      race.participants?.map((participant) => participant.user) ?? [];
    await Promise.all(
      userIds.map((user) => dispatch(addUserFromId(user)).unwrap())
    );

    return true;
  }
);
