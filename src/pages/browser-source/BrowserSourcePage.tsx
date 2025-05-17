import { useParams, useSearchParams } from "react-router";
import { FRAMES } from "./frames";
import { useAppSelector } from "../../data/hooks";
import { selectCurrentDisplayRace } from "../../data/stages/selectors";

export function BrowserSourcePage() {
  const { frameId } = useParams();
  const participantIndex = useParticipantIndexFromUrl();
  const frame = FRAMES.find((frame) => frame.frameId === frameId);
  const currentRace = useAppSelector(selectCurrentDisplayRace);

  if (!frame) {
    return <p>Invalid frame!</p>;
  }

  if (!currentRace) {
    return null;
  }

  return <frame.fc race={currentRace} participantIndex={participantIndex} />;
}

function useParticipantIndexFromUrl() {
  const [searchParams] = useSearchParams();
  const participantIndexParam = searchParams.get("participantIndex");
  if (!participantIndexParam) {
    return undefined;
  }

  const participantIndex = parseInt(participantIndexParam);
  if (isNaN(participantIndex)) {
    return undefined;
  }

  return participantIndex;
}
