import { RaceParticipantWithLiveData } from "../../races/types";
import { User } from "../../users/types";
import { buildDisplayParticipant } from "../participant/buildDisplayParticipants";
import { RaceDisplayFieldGetter } from "../participant/displayParticipantFields";
import { DisplayRace } from "./types";

export type ParticipantDisplayFieldGetter<TValue> = (
  participant: RaceParticipantWithLiveData,
  profile: Partial<User>
) => TValue;

// A structured builder for the DisplayRace object, when given the raw "Race" and "User"
// objects retrieved from therun. We could use those directly, but having an intermediary
// type lets us keep our display components simple, and means if therun's data structure
// changes we should only need to make changes to this file.
//
// All you should need to do to add a field to this is add it to the DisplayRace interface,
// and then add a function here to build it.
export const DISPLAY_RACE_FIELDS: {
  [K in keyof DisplayRace]: RaceDisplayFieldGetter<DisplayRace[K]>;
} = {
  raceId: (race) => race.raceId,
  game: (race) => race.displayGame,
  category: (race) => race.displayCategory,
  participants: (race, userEntities) => {
    return (
      race.participants?.map((participant) =>
        buildDisplayParticipant(
          participant,
          userEntities[participant.user] ?? {}
        )
      ) ?? []
    );
  },
  status: (race) => race.status,
  commentators: () => [],
  startTime: (race) => race.startTime,
  endTime: (race) => race.endTime,
};
