import { vi } from "vitest";

// First-class fake for obs-websocket-js. Every OBS interaction in the app flows
// through `useOBSWebsocket()` -> `socket.connect/call/addListener/removeListener`,
// so mocking the library boundary gives us full control over the connection and
// lets us assert on the exact requests the app sends to OBS.

export type ObsRequestHandler = (
  requestData?: unknown
) => unknown | Promise<unknown>;

// Mirrors obs-websocket-js's OBSWebSocketError so `instanceof` checks in app code
// (e.g. the name-collision retry in OBSInsertButton) work against a fake thrown here.
export class OBSWebSocketError extends Error {
  code?: number;

  constructor(message?: string, code?: number) {
    super(message);
    this.name = "OBSWebSocketError";
    this.code = code;
  }
}

export class FakeObsSocket {
  static instances: FakeObsSocket[] = [];

  // Default result for connect() on newly created sockets. Set before a component
  // mounts (before the socket exists) to control whether the initial connection
  // succeeds. Reset by resetObsSockets().
  static connectBehavior: () => Promise<void> = async () => {};

  isConnected = false;

  connect = vi.fn(async () => {
    await FakeObsSocket.connectBehavior();
    this.isConnected = true;
  });

  disconnect = vi.fn(() => {
    this.isConnected = false;
  });

  call = vi.fn(
    async (requestType: string, requestData?: unknown): Promise<unknown> => {
      const handler = this.requestHandlers.get(requestType);
      if (handler) {
        return handler(requestData);
      }
      return this.autoResponse;
    }
  );

  addListener = vi.fn(
    (eventName: string, callback: (data?: unknown) => void) => {
      const listeners = this.eventListeners.get(eventName) ?? new Set();
      listeners.add(callback);
      this.eventListeners.set(eventName, listeners);
    }
  );

  removeListener = vi.fn(
    (eventName: string, callback: (data?: unknown) => void) => {
      this.eventListeners.get(eventName)?.delete(callback);
    }
  );

  private requestHandlers = new Map<string, ObsRequestHandler>();
  private autoResponse: unknown = undefined;
  private eventListeners = new Map<string, Set<(data?: unknown) => void>>();

  constructor() {
    FakeObsSocket.instances.push(this);
  }

  // --- test helpers ---

  // Fire an OBS event at any listener registered via addListener (e.g. a
  // SceneItemSelected event from selecting a scene item in OBS).
  emit(eventName: string, data?: unknown) {
    for (const listener of this.eventListeners.get(eventName) ?? []) {
      listener(data);
    }
  }

  // Configure a canned response (or rejection) for a request type.
  respondTo(requestType: string, handler: ObsRequestHandler): this {
    this.requestHandlers.set(requestType, handler);
    return this;
  }

  // Configure the default response for unhandled request types.
  respondToUnhandled(response: unknown): this {
    this.autoResponse = response;
    return this;
  }
}

export function lastObsSocket(): FakeObsSocket {
  const socket = FakeObsSocket.instances[FakeObsSocket.instances.length - 1];
  if (!socket) {
    throw new Error("No OBS socket created yet. Did ObsWebSocketProvider mount?");
  }
  return socket;
}

export function resetObsSockets() {
  FakeObsSocket.instances = [];
  FakeObsSocket.connectBehavior = async () => {};
}
