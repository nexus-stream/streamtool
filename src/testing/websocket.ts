import { vi } from "vitest";

// First-class fake for the browser WebSocket that RaceLiveUpdater uses to pull
// live race/participant updates from therun.gg. Lets tests drive `message` events
// into the app and record every connection the app opens.

export class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  url: string;
  close = vi.fn();

  private listeners = new Map<string, Set<(data?: unknown) => void>>();

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, callback: (data?: unknown) => void) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(callback);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type: string, callback: (data?: unknown) => void) {
    this.listeners.get(type)?.delete(callback);
  }

  // Fire an event at any listener registered via addEventListener.
  emit(type: string, data?: unknown) {
    for (const callback of this.listeners.get(type) ?? []) {
      callback(data);
    }
  }
}

export function lastWebSocket(): FakeWebSocket {
  const ws = FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
  if (!ws) {
    throw new Error("No WebSocket created yet");
  }
  return ws;
}

export function resetWebSockets() {
  FakeWebSocket.instances = [];
}

export function stubWebSocket() {
  vi.stubGlobal("WebSocket", FakeWebSocket);
}
