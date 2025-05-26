import { useParams, useSearchParams } from "react-router";
import { FRAMES } from "./frames";
import { useAppSelector } from "../../data/hooks";
import { selectCurrentPatchedDisplayRace } from "../../data/stages/selectors";
import { useMemo } from "react";
import { errorFrame } from "./frames/error";

export function BrowserSourcePage() {
  const currentRace = useAppSelector(selectCurrentPatchedDisplayRace);
  const { frame, params } = useFrameWithParsedParams();

  if (!currentRace) {
    return null;
  }

  return <frame.fc race={currentRace} {...params} />;
}

function useFrameWithParsedParams() {
  const frame = useFrame();
  const searchParams = useSearchParamsObject();

  if (!frame) {
    return {
      frame: errorFrame,
      params: {
        message: "Frame not found",
      },
    };
  }

  try {
    const params = frame.zodProps.parse(searchParams);
    return { frame, params };
  } catch {
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
