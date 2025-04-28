import { Frame, FrameProps } from "../frame";

function NameFrame({ race, participantIndex }: FrameProps) {
  if (!participantIndex) {
    return null;
  }

  return <p>{race.participants[participantIndex].displayName}</p>;
}

export const nameFrame: Frame = {
  fc: NameFrame,
  frameId: "name",
  displayName: "Participant Name",
};
