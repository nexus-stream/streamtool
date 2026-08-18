import { vi } from "vitest";
import type { Race } from "../data/races/types";
import type { User } from "../data/users/types";

// Helpers to stub the global `fetch` that the Twitch and TheRun integrations call.
// Both integrations talk HTTP through `fetch`, so the boundary we mock is the network
// call itself; the app's URL building and response parsing stay real.

export type FetchMock = ReturnType<typeof vi.fn>;

function jsonResponse(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

export function stubFetch(): FetchMock {
  const mock = vi.fn(async () => {
    throw new Error("Unexpected fetch call; stub a route or seed the mock");
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

export interface TwitchStubOverrides {
  // Response for GET /oauth2/validate (the token + identity check).
  validate?: () => Record<string, unknown>;
  // Response for GET /helix/games?name=... (lookup a game id by name).
  games?: (url: string) => Record<string, unknown>;
  // Response for GET /helix/search/categories (search games).
  categories?: (url: string) => Record<string, unknown>;
  // Response for PATCH /helix/channels (the stream title/game update).
  channels?: (url: string) => Record<string, unknown>;
}

export const TWITCH_VALIDATE_URL = "https://id.twitch.tv/oauth2/validate";

export function validTwitchTokenResponse(): Record<string, unknown> {
  return {
    status: "200",
    login: "broadcaster",
    user_id: "12345",
    expires_in: 3600,
  };
}

export function mockTwitchFetch(overrides: TwitchStubOverrides = {}): FetchMock {
  const mock = vi.fn(async (url: string | URL | Request) => {
    const u = String(url);

    if (u === TWITCH_VALIDATE_URL) {
      return jsonResponse(
        overrides.validate ? overrides.validate() : validTwitchTokenResponse()
      );
    }
    if (u.startsWith("https://api.twitch.tv/helix/games")) {
      return jsonResponse(
        overrides.games
          ? overrides.games(u)
          : { data: [{ id: "game-1", name: "Super Mario 64" }] }
      );
    }
    if (u.startsWith("https://api.twitch.tv/helix/search/categories")) {
      return jsonResponse(
        overrides.categories ? overrides.categories(u) : { data: [] }
      );
    }
    if (u.startsWith("https://api.twitch.tv/helix/channels")) {
      return jsonResponse(overrides.channels ? overrides.channels(u) : {});
    }

    throw new Error(`Unexpected fetch to: ${u}`);
  });

  vi.stubGlobal("fetch", mock);
  return mock;
}

export function mockTheRunFetch(race: Race, users: Record<string, User>): FetchMock {
  const mock = vi.fn(async (url: string | URL | Request) => {
    const u = String(url);

    if (u.endsWith(`/races/${race.raceId}`)) {
      return jsonResponse({ result: race });
    }

    const userMatch = u.match(/\/users\/([^/]+)\/global$/);
    if (userMatch && users[userMatch[1]]) {
      return jsonResponse(users[userMatch[1]]);
    }

    throw new Error(`Unexpected fetch to: ${u}`);
  });

  vi.stubGlobal("fetch", mock);
  return mock;
}
