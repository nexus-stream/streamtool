import { Race } from "../races/types";
import { User } from "../users/types";
import { DisplayParticipant, DisplayRace, RaceOverrides } from "./types";

export function buildDisplayRace(
  race: Race,
  overrides: RaceOverrides,
  userEntities: Record<string, User>
): DisplayRace {
  return {
    game: overrides.game ?? race.displayGame,
    category: overrides.category ?? race.displayCategory,
    status: race.status,
    startTime: race.startTime,
    endTime: race.endTime,
    participants:
      race.participants?.map((participant): DisplayParticipant => {
        const participantOverrides =
          overrides.participantOverrides[participant.user] ?? {};
        const profile: Partial<User> = userEntities[participant.user] ?? {};
        return {
          user: participant.user,
          twitchUser: participant.user,
          displayName: participant.user,
          pronouns: profile.pronouns,
          avatar: profile.picture,
          status: participant.status,
          ...participantOverrides,
        };
      }) ?? [],
  };
}
