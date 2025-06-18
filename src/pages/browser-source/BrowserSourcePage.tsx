import { useParams, useSearchParams } from "react-router";
import { FRAMES } from "./frames";
import { useAppSelector } from "../../data/hooks";
import {
  selectCurrentPatchedDisplayRace,
  selectCurrentStageId,
} from "../../data/stages/selectors";
import { useMemo } from "react";
import { errorFrame } from "./frames/error";
import qs from "qs";

export function BrowserSourcePage() {
  const stageId = useAppSelector(selectCurrentStageId);
  const currentRace = useAppSelector(selectCurrentPatchedDisplayRace);
  const { frame, params } = useFrameWithParsedParams();

  if (!stageId || (!currentRace && !frame.displayProperties.skipRequireRace)) {
    return null;
  }

  return <frame.fc stageId={stageId} race={currentRace!} {...params} />;
}

function useFrameWithParsedParams() {
  const frame = useFrame();
  const searchParams = useSearchParamsObject();

  try {
    const params = useMemo(
      () => frame!.zodProps.parse(qs.parse(searchParams)),
      [frame, searchParams]
    );
    return { frame: frame!, params };
  } catch {
    if (!frame) {
      return {
        frame: errorFrame,
        params: {
          message: "Frame not found",
        },
      };
    }

    return {
      frame: errorFrame,
      params: {
        message: `Invalid parameters in URL for the frame: ${frame.displayProperties.displayName}`,
      },
    };
  }
}

function useFrame() {
  const { frameId } = useParams();

  if (!frameId) {
    return undefined;
  }

  return FRAMES[frameId];
}

function useSearchParamsObject() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);
}
