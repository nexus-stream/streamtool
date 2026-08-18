import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { FakeObsSocket, OBSWebSocketError, resetObsSockets } from "./obs";
import { resetWebSockets, stubWebSocket } from "./websocket";

// jest-dom matchers (toBeInTheDocument, etc.) for vitest's expect.

// ObsWebSocketProvider creates an OBSWebSocket on mount; route the library to our
// fake so tests control the connection and record every request the app sends.
vi.mock("obs-websocket-js", () => ({
  default: FakeObsSocket,
  OBSWebSocket: FakeObsSocket,
  OBSWebSocketError,
  EventSubscription: {
    None: 0,
    General: 1,
    Config: 2,
    Scenes: 4,
    Inputs: 8,
    Transitions: 16,
    Filters: 32,
    Outputs: 64,
    SceneItems: 128,
    SceneItemTransformChanged: 524288,
  },
}));

beforeEach(() => {
  resetObsSockets();
  resetWebSockets();
  stubWebSocket();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
