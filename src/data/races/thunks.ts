import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRace } from "./api";
import { upsertRace } from "./raceSlice";
import { addUserFromId } from "../users/thunks";

// Retrieve a race for the given ID from therun and dispatch it to Redux. Also,
// retrieve info for each participant in the race and dispatch that to Redux as
// well.
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
