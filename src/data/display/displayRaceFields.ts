import { buildDisplayParticipant } from "./buildDisplayParticipants";
import { DisplayRace, RaceDisplayFieldGetter } from "./types";

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
  startTime: (race) => race.startTime,
  endTime: (race) => race.endTime,
};
