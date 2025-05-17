interface Props {
  raceId: string;
}

// Make a websocket connection for the current race and dispatch actions when we
// are notified of changes. Should clean up any connections when the component
// is destroyed.
export function RaceLiveUpdater({ raceId }: Props) {
  const endpoint = buildWebsocketEndpoint(raceId);
  return <p>{endpoint}</p>;
}

function buildWebsocketEndpoint(raceId: string): string {
  return `wss://ws.therun.gg?race=${raceId}`;
}
