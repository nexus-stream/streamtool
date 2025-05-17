import { Participant, RaceInfo, TimerInfo } from "../data/types";
import { Race, RaceParticipant, User } from "./types";

// https://races.therun.gg/z5xv

const MOCK_RACE_INFO: RaceInfo = {
  game: "Super Mario 64",
  category: "16 Star",
  participants: [
    {
      user: "kyl3byte",
      twitchUser: "kyl3byte",
      displayName: "Kyl3byte",
      pronouns: "he / him",
      avatar: "",
      status: "finished",
    },
    {
      user: "serenmew",
      twitchUser: "serenmew",
      displayName: "serenmew",
      pronouns: "",
      avatar: "",
      status: "started",
    },
  ],
  timerInfo: {
    status: "stopped",
    currentTime: 5200,
  },
};

// Retrieves race information for the given race id and builds a RaceInfo
// object.
export async function getRaceInfo(raceId: string): Promise<RaceInfo> {
  if (raceId === "test") {
    return MOCK_RACE_INFO;
  }

  const endpoint = buildRaceEndpoint(raceId);
  const rawRace: Race = await (await fetch(endpoint)).json();

  const participants = await Promise.all(
    rawRace.participants?.map(buildParticipant) ?? []
  );

  return {
    game: rawRace.displayGame,
    category: rawRace.displayCategory,
    participants,
    timerInfo: buildTimerInfo(rawRace),
  };
}

export async function buildParticipant(
  rawParticipant: RaceParticipant
): Promise<Participant> {
  const endpoint = buildUserEndpoint(rawParticipant.user);
  const userInfo: User = await (await fetch(endpoint)).json();

  return {
    user: rawParticipant.user,
    twitchUser: rawParticipant.user,
    displayName: userInfo.user,
    pronouns: userInfo.prounouns,
    avatar: userInfo.picture,
    status: rawParticipant.status,
  };
}

function buildTimerInfo(rawRace: Race): TimerInfo {
  if (!rawRace.startTime) {
    return {
      status: "stopped",
      currentTime: 0,
    };
  }

  switch (rawRace.status) {
    case "pending":
    case "starting":
      return {
        status: "stopped",
        currentTime: 0,
      };
    case "aborted":
    case "finished":
      if (!rawRace.endTime) {
        return {
          status: "stopped",
          currentTime: 0,
        };
      }

      return {
        status: "stopped",
        currentTime:
          new Date(rawRace.endTime).getTime() -
          new Date(rawRace.startTime).getTime(),
      };
    case "progress":
      return {
        status: "running",
        startTime: new Date(rawRace.startTime).getTime(),
      };
  }
}

function buildRaceEndpoint(raceId: string): string {
  return `https://races.therun.gg/${raceId}`;
}

function buildUserEndpoint(user: string): string {
  return `https://therun.gg/api/users/${user}/global`;
}
