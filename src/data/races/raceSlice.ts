import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Race, RaceParticipant } from "./types";

export const raceAdapter = createEntityAdapter({
  selectId: (race: Race) => race.raceId,
});

const raceSlice = createSlice({
  name: "races",
  initialState: raceAdapter.getInitialState(),
  reducers: {
    upsertRace(state, action: PayloadAction<Race>) {
      raceAdapter.upsertOne(state, action.payload);
    },
    removeRace(state, action: PayloadAction<string>) {
      raceAdapter.removeOne(state, action.payload);
    },
    updateParticipant(state, action: PayloadAction<RaceParticipant>) {
      const race = state.entities[action.payload.raceId];
      if (!race || !race.participants) {
        return;
      }

      const participantIndex = race.participants.findIndex(
        (participant) => participant.user === action.payload.user
      );

      if (participantIndex === -1) {
        // I assume added participants come in as a new race because of the other
        // fields it'd affect, but if they don't then this needs to be made more
        // complicated.

        // Best solution would be to make this a thunk and dispatch a fresh fetch
        // + upsertRace when a participant is added.
        return;
      }

      race.participants[participantIndex] = action.payload;
    },
  },
});

export const { upsertRace, updateParticipant } = raceSlice.actions;
export default raceSlice.reducer;

export const raceRootSelector = (state: RootState) => state.races;
