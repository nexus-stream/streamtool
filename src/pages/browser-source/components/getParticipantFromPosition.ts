import { DisplayParticipant } from "../../../data/display/race/types";

export function getParticipantFromPosition(
  participants: DisplayParticipant[],
  positionType: "manual" | "results",
  participantPosition: number
) {
  const index = participantPosition - 1;
  if (positionType === "manual") {
    return participants[index];
  }

  // return getResultParticipants(participants)[index];
}
