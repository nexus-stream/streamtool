import { RaceParticipantWithLiveData } from "../../races/types";
import { User } from "../../users/types";
import { buildDisplayParticipant } from "../participant/buildDisplayParticipants";
import { RaceDisplayFieldGetter } from "../participant/displayParticipantFields";
import { DisplayRace } from "../participant/types";

export type ParticipantDisplayFieldGetter<TValue> = (
  participant: RaceParticipantWithLiveData,
  profile: Partial<User>
) => TValue;

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
