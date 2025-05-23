import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { addRaceFromId } from "../races/thunks";

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
      console.log(event.data);
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
