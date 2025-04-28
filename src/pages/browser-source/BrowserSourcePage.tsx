import { useParams, useSearchParams } from "react-router";
import { NameFrame } from "./frames/NameFrame";
import { TimerFrame } from "./frames/TimerFrame";
import { useSelector } from "react-redux";
import { selectCurrentStage } from "../../data/selectors";
import { FrameProps } from "./frameProps";

const FRAME_MAPPING: { [frameId: string]: React.FC<FrameProps> } = {
  name: NameFrame,
  timer: TimerFrame,
};

export function BrowserSourcePage() {
  const { frameId } = useParams();
  const runnerIndex = useRunnerIndexFromUrl();
  const Frame = FRAME_MAPPING[frameId ?? ""];
  const currentStage = useSelector(selectCurrentStage);

  if (!Frame) {
    return <p>Invalid frame!</p>;
  }

  if (!currentStage) {
    return null;
  }

  return <Frame stage={currentStage} runnerIndex={runnerIndex} />;
}

function useRunnerIndexFromUrl() {
  const [searchParams] = useSearchParams();
  const runnerIndexParam = searchParams.get("runnerIndex");
  if (!runnerIndexParam) {
    return undefined;
  }

  const runnerIndex = parseInt(runnerIndexParam);
  if (isNaN(runnerIndex)) {
    return undefined;
  }

  return runnerIndex;
}
