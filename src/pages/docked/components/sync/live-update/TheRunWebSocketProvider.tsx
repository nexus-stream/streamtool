import { ReactNode, useState, useCallback, useMemo } from "react";
import {
  TheRunStatus,
  TheRunWebSocketContext,
} from "./TheRunWebSocketContext";

export function TheRunWebSocketProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, TheRunStatus>>({});

  const registerStatus = useCallback((raceId: string, status: TheRunStatus) => {
    setStatuses((prev) => {
      if (prev[raceId] === status) return prev;
      return { ...prev, [raceId]: status };
    });
  }, []);

  const unregisterStatus = useCallback((raceId: string) => {
    setStatuses((prev) => {
      if (!(raceId in prev)) return prev;
      const copy = { ...prev };
      delete copy[raceId];
      return copy;
    });
  }, []);

  const aggregateStatus: TheRunStatus = useMemo(() => {
    const values = Object.values(statuses);
    if (values.length === 0) return "idle";
    if (values.some((s) => s === "connected")) return "connected";
    if (values.some((s) => s === "connecting")) return "connecting";
    if (values.some((s) => s === "error")) return "error";
    return "idle";
  }, [statuses]);

  return (
    <TheRunWebSocketContext.Provider
      value={{
        status: aggregateStatus,
        registerStatus,
        unregisterStatus,
      }}
    >
      {children}
    </TheRunWebSocketContext.Provider>
  );
}
