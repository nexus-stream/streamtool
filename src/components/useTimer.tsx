import { useEffect, useState } from "react";
import { DisplayParticipant, DisplayRace } from "../data/display/types";

export function useRaceTime(race: DisplayRace): string {
  const currentTime = useCurrentTime();

  if (race.startTime) {
    return formatTimer(currentTime - new Date(race.startTime).getTime());
  }

  return formatTimer(0);
}

export function useParticipantTime(
  participant: DisplayParticipant,
  race: DisplayRace
): string {
  const currentTime = useCurrentTime();

  if (participant.finalTime) {
    return formatTimer(participant.finalTime);
  }

  if (participant.startTime) {
    return formatTimer(currentTime - participant.startTime);
  }

  if (participant.status === "started" && race.startTime) {
    return formatTimer(currentTime - new Date(race.startTime).getTime());
  }

  return formatTimer(0);
}

function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return currentTime;
}

function formatTimer(ms: number) {
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
