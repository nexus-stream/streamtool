import { createContext, useContext } from "react";

export type TheRunStatus = "idle" | "connected" | "connecting" | "error";

export interface TheRunWebSocketContextValue {
  status: TheRunStatus;
  registerStatus: (raceId: string, status: TheRunStatus) => void;
  unregisterStatus: (raceId: string) => void;
}

export const TheRunWebSocketContext = createContext<TheRunWebSocketContextValue>({
  status: "idle",
  registerStatus: () => {},
  unregisterStatus: () => {},
});

export function useTheRunStatus(): TheRunStatus {
  return useContext(TheRunWebSocketContext).status;
}

export function useTheRunStatusReporter() {
  const { registerStatus, unregisterStatus } = useContext(TheRunWebSocketContext);
  return { registerStatus, unregisterStatus };
}
