export function formatTimer(ms: number) {
  ms = Math.max(ms, 0);
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${padTimerSegment(hours)}:${padTimerSegment(
    minutes
  )}:${padTimerSegment(seconds)}`;
}

function padTimerSegment(num: number): string {
  return `${num}`.padStart(2, "0");
}
