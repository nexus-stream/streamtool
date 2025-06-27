import { useParams, useSearchParams } from "react-router";
import { FRAMES } from "./frames";
import { useMemo } from "react";
import { errorFrame } from "./frames/error";
import qs from "qs";

// The page that renders "frames" - pretty pages that can be added to OBS as browser
// sources and automatically update as stages / the underlying data from therun changes.
//
// We do some fun typescript shenanigans here (as evidenced by the many any's and !'s).
// More of it's explained in frame.ts, but the gist is that we pull the configuration
// for the frame out of the query params, attempt to parse it with the zod object attached
// to the frame matching the frame id in our path params, and then render the frame's
// component with those configuration options.
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
