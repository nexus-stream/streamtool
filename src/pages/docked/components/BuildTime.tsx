const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "shortOffset",
});

const formattedDateString = dateTimeFormatter.format(
  parseInt(import.meta.env.VITE_BUILD_TIME)
);

export function BuildTime() {
  return <div>{formattedDateString}</div>;
}
