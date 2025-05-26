import { Race, RaceParticipantWithLiveData } from "../races/types";
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
          pronouns: profile.pronouns ?? null,
          avatar: profile.picture ?? null,
          status: participant.status,
          ...participantOverrides,
        };
      }) ?? [],
  };
}

interface RaceDisplayField<TValue> {
  getValue: (race: Race) => TValue;
  override?: {
    getOverride: (overrides: RaceOverrides) => TValue | undefined;
    buildOverridePatch: (value: TValue | undefined) => Partial<RaceOverrides>;
  };
}

interface ParticipantDisplayField<TValue> {
  getValue: (
    participant: RaceParticipantWithLiveData,
    profile: Partial<User>
  ) => TValue;
  override?: {
    getOverride: (overrides: DisplayParticipant) => TValue | undefined;
    buildOverridePatch: (
      value: TValue | undefined
    ) => Partial<DisplayParticipant>;
  };
}
