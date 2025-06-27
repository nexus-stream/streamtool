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
        // When a new participant gets added, we also receive a race update so we
        // can safely skip updates for nonexistent participants.
        return;
      }

      race.participants[participantIndex] = action.payload;
    },
  },
});

export const { upsertRace, updateParticipant } = raceSlice.actions;
export default raceSlice.reducer;

export const raceRootSelector = (state: RootState) => state.races;
