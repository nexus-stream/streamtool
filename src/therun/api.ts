import { RaceInfo } from "../data/types";

// Retrieves race information for the given race id and builds a RaceInfo
// object.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRaceInfo(_raceId: string): Promise<RaceInfo> {
  return {
    game: "Super Mario 64",
    category: "16 Star",
    participants: [
      {
        user: "kyl3byte",
        twitchUser: "kyl3byte",
        displayName: "Kyl3byte",
        pronouns: "he / him",
        avatar: "",
      },
      {
        user: "serenmew",
        twitchUser: "serenmew",
        displayName: "serenmew",
        pronouns: "",
        avatar: "",
      },
    ],
    timerInfo: {
      status: "stopped",
      currentTime: 5200,
    },
  };
}
