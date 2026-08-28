import { useEffect } from "react";
import { useAppDispatch } from "../../../../../data/hooks";
import {
  upsertRace,
  updateParticipant,
} from "../../../../../data/races/raceSlice";
import { addRaceFromId } from "../../../../../data/races/thunks";
import { LiveUpdateMessage } from "./types";
import { useTheRunStatusReporter } from "./TheRunWebSocketContext";

interface Props {
  raceId: string;
}

// Make a websocket connection for the current race and dispatch actions when we
// are notified of changes. Should clean up any connections when the component
// is destroyed.
export function RaceLiveUpdater({ raceId }: Props) {
  const dispatch = useAppDispatch();
  const { registerStatus, unregisterStatus } = useTheRunStatusReporter();

  useEffect(() => {
    // Re-fetch race data on init to replace stale data on a page reload. This will
    // cause a double fetch on the initial add, but oh well.
    dispatch(addRaceFromId(raceId));
  }, [dispatch, raceId]);

  useEffect(() => {
    registerStatus(raceId, "connecting");
    const ws = new WebSocket(buildWebsocketEndpoint(raceId));

    const onOpen = () => {
      registerStatus(raceId, "connected");
    };

    const onClose = () => {
      registerStatus(raceId, "idle");
    };

    const onError = () => {
      registerStatus(raceId, "error");
    };

    const onMessage = (event: MessageEvent) => {
      // Message received proves connection is active
      registerStatus(raceId, "connected");
      const message: LiveUpdateMessage = JSON.parse(event.data);
      switch (message.type) {
        case "raceUpdate":
          dispatch(upsertRace(message.data));
          break;
        case "participantUpdate":
          dispatch(updateParticipant(message.data));
          break;
      }
    };

    ws.addEventListener("open", onOpen);
    ws.addEventListener("close", onClose);
    ws.addEventListener("error", onError);
    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("close", onClose);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("message", onMessage);
      ws.close();
      unregisterStatus(raceId);
    };
  }, [dispatch, raceId, registerStatus, unregisterStatus]);

  return null;
}

function buildWebsocketEndpoint(raceId: string): string {
  return `wss://ws.therun.gg?race=${raceId}`;
}
