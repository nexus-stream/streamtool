import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRace } from "./api";
import { updateParticipant, upsertRace } from "./raceSlice";
import { addUserFromId } from "../users/thunks";
import { RaceParticipant } from "./types";
import { RootState } from "../store";

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

export const updateParticipantAndRefetchRaceIfNew = createAsyncThunk(
  "updateParticipantAndRefetchRaceIfNew",
  async (participant: RaceParticipant, { dispatch, getState }) => {
    const state = getState() as RootState;
    const race = state.races.entities[participant.raceId];
    if (!race?.participants?.find((other) => other.user === participant.user)) {
      dispatch(addRaceFromId(participant.raceId));
    }

    dispatch(updateParticipant(participant));
  }
);
