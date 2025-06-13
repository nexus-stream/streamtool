import { Action } from "@reduxjs/toolkit";

export interface ObsTunnelMessage {
  kind: "obs-tunnel-message";
  action: Action;
}

export function wrapObsTunnelMessage(action: Action): ObsTunnelMessage {
  return {
    kind: "obs-tunnel-message",
    action,
  };
}

export function unwrapObsTunnelMessage(message: unknown): Action | undefined {
  const weakTypedMessage = message as { kind: string } & ObsTunnelMessage;
  if (weakTypedMessage.kind !== "obs-tunnel-message") {
    return undefined;
  }

  return weakTypedMessage.action;
}
