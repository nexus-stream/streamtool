import { useEffect, useState } from "react";
import { DisplayParticipant, DisplayRace } from "./types";
import { useDisplayRaceValue } from "./useDisplayRaceValue";

export function useDisplayRaceTimer(race: DisplayRace) {
  return useRaceTime(race.startTime, race.endTime);
}

export function useStageRaceTimer(stageId: string) {
  const raceStartTime = useDisplayRaceValue("startTime", stageId);
  const raceEndTime = useDisplayRaceValue("endTime", stageId);
  return useRaceTime(raceStartTime, raceEndTime);
}

export function useDisplayRaceParticipantTimer(
  participant: DisplayParticipant,
  race: DisplayRace
) {
  return useParticipantTime(participant, race.startTime);
}

export function useStageParticipantTimer(
  participant: DisplayParticipant,
  stageId: string
) {
  const raceStartTime = useDisplayRaceValue("startTime", stageId);
  return useParticipantTime(participant, raceStartTime);
}

function useRaceTime(
  raceStartTime: string | null,
  raceEndTime: string | null
): string {
  const currentTime = useCurrentTime();

  if (raceStartTime && raceEndTime) {
    return formatTimer(
      new Date(raceEndTime).getTime() - new Date(raceStartTime).getTime()
    );
  }

  if (raceStartTime) {
    return formatTimer(currentTime - new Date(raceStartTime).getTime());
  }

  return formatTimer(0);
}

function useParticipantTime(
  participant: DisplayParticipant,
  raceStartTime: string | null
): string {
  const currentTime = useCurrentTime();

  if (participant.finalTime) {
    return formatTimer(participant.finalTime);
  }

  if (participant.status === "started") {
    if (participant.startTime) {
      return formatTimer(currentTime - participant.startTime);
    }

    if (raceStartTime) {
      return formatTimer(currentTime - new Date(raceStartTime).getTime());
    }
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

export function formatTimer(ms: number) {
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
