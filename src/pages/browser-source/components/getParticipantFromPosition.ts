import { DisplayParticipant } from "../../../data/display/types";

export function getParticipantFromPosition(
  participants: DisplayParticipant[],
  positionType: "manual" | "results",
  participantPosition: number
) {
  const index = participantPosition - 1;
  if (positionType === "manual") {
    return participants[index];
  }

  const sortedParticipants = [...participants].sort((a, b) => {
    const aFinished = a.status === "finished" || a.status === "confirmed";
    const bFinished = b.status === "finished" || b.status === "confirmed";

    if (aFinished && !bFinished) {
      return -1;
    }

    if (!aFinished && bFinished) {
      return 1;
    }

    if (a.finalTime && !b.finalTime) {
      return -1;
    }

    if (!a.finalTime && b.finalTime) {
      return 1;
    }

    if (a.finalTime && b.finalTime) {
      return a.finalTime - b.finalTime;
    }

    return 0;
  });

  return sortedParticipants[index];
}
