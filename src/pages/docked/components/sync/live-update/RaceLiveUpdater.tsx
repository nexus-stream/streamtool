import { useEffect } from "react";
import { useAppDispatch } from "../../../../../data/hooks";
import {
  upsertRace,
  updateParticipant,
} from "../../../../../data/races/raceSlice";
import { addRaceFromId } from "../../../../../data/races/thunks";
import { LiveUpdateMessage } from "./types";

interface Props {
  raceId: string;
}

// Make a websocket connection for the current race and dispatch actions when we
// are notified of changes. Should clean up any connections when the component
// is destroyed.
export function RaceLiveUpdater({ raceId }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Re-fetch race data on init to replace stale data on a page reload. This will
    // cause a double fetch on the initial add, but oh well.
    dispatch(addRaceFromId(raceId));
  }, [dispatch, raceId]);

  useEffect(() => {
    const ws = new WebSocket(buildWebsocketEndpoint(raceId));
    ws.addEventListener("message", (event) => {
      const message: LiveUpdateMessage = JSON.parse(event.data);
      switch (message.type) {
        case "raceUpdate":
          dispatch(upsertRace(message.data));
          break;
        case "participantUpdate":
          dispatch(updateParticipant(message.data));
          break;
      }
    });

    return () => {
      ws.close();
    };
  }, [dispatch, raceId]);

  return null;
}

function buildWebsocketEndpoint(raceId: string): string {
  return `wss://ws.therun.gg?race=${raceId}`;
}
