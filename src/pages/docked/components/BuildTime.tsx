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

// Useful debug information to make sure you're on the latest version of the tool.
export function BuildTime() {
  return <div>Build Time: {formattedDateString}</div>;
}
