import { useSelector } from "react-redux";
import {
  clearTwitchToken,
  twitchRootSelector,
  updateTwitchExpiration,
} from "../data/twitch/twitchSlice";
import { useCallback } from "react";
import { useAppDispatch } from "../data/hooks";

export interface TwitchApi {
  validate(): Promise<string | undefined>;
  getGameId(name: string): Promise<string | undefined>;
  updateStreamInfo(title: string, gameId: string): Promise<void>;
}

// Builds functions to call the Twitch API using the accessToken that
// we've stored in Redux.
export function useTwitchApi(): TwitchApi {
  const dispatch = useAppDispatch();
  const { accessToken } = useSelector(twitchRootSelector);

  const req = useCallback(
    async (
      url: string,
      {
        method = "GET",
        body,
        omitClientId,
      }: {
        method?: "GET" | "PATCH";
        body?: string;
        omitClientId?: boolean;
      } = {}
    ) => {
      const headers: HeadersInit = {
        Authorization: `Bearer ${accessToken}`,
      };
      if (!omitClientId) {
        headers["Client-Id"] = import.meta.env.VITE_TWITCH_CLIENT_ID;
      }
      if (body) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (method === "GET") {
        return await response.json();
      }
    },
    [accessToken]
  );

  const validate = useCallback(async () => {
    const data = await req("https://id.twitch.tv/oauth2/validate", {
      omitClientId: true,
    });

    if (data.status === "401") {
      dispatch(clearTwitchToken());
      return undefined;
    }

    dispatch(updateTwitchExpiration(data.expires_in));

    return data.user_id;
  }, [dispatch, req]);

  const getGameId = useCallback(
    async (name: string) => {
      const result = await validate();
      if (!result) {
        return undefined;
      }

      const url = new URL("/helix/games", "https://api.twitch.tv");
      url.searchParams.append("name", name);

      const { data } = await req(url.toString());
      if (data.length === 0) {
        return undefined;
      }

      return data[0].id;
    },
    [req, validate]
  );

  const updateStreamInfo = useCallback(
    async (title: string, game: string) => {
      const broadcasterId = await validate();
      if (!broadcasterId) {
        return;
      }

      const gameId = await getGameId(game);

      const url = new URL("/helix/channels", "https://api.twitch.tv");
      url.searchParams.append("broadcaster_id", broadcasterId);

      await req(url.toString(), {
        body: JSON.stringify({
          game_id: gameId,
          title,
        }),
        method: "PATCH",
      });
    },
    [getGameId, req, validate]
  );

  return { validate, getGameId, updateStreamInfo };
}
