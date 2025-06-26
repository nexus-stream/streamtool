import { useParams, useSearchParams } from "react-router";
import { FRAMES } from "./frames";
import { useMemo } from "react";
import { errorFrame } from "./frames/error";
import qs from "qs";

export function BrowserSourcePage() {
  const { frame, params } = useFrameWithParsedParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <frame.fc {...(params as any)} />;
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
