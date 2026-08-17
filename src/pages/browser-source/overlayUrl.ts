import qs from "qs";
import { FRAMES } from "./frames";
import { FrameComponent } from "./frame";

// Builds and parses the URLs that point at BrowserSourcePage with a frame's config.
// Keeping both directions here means the adder (build) and the auto-resizer / editor
// (parse) can't drift apart on the URL shape.

const framePathnameRegex = /^\/frame\/([^/]+)$/;

export function buildOBSOverlayURL(frameId: string, params: object): string {
  if (!frameId) {
    return "";
  }

  const origin = window.location.origin;
  const url = new URL(`/frame/${frameId}`, origin);
  return `${url.toString()}?${qs.stringify(params)}`;
}

export interface ParsedOverlayURL {
  frameId: string;
  frame: FrameComponent;
  rawParams: Record<string, unknown>;
}

// Given the settings of an input in OBS, determine whether it's a browser source
// pointing at one of our frames and, if so, return the frame and its raw (still
// string-encoded) query params.
export function parseOBSOverlayURL(
  inputSettings: { [key: string]: unknown },
  inputKind: string
): ParsedOverlayURL | undefined {
  if (inputKind !== "browser_source" || typeof inputSettings.url !== "string") {
    return undefined;
  }

  const inputUrl = new URL(inputSettings.url);
  if (inputUrl.origin !== window.location.origin) {
    return undefined;
  }

  const frameId = inputUrl.pathname.match(framePathnameRegex)?.[1];
  const frame = frameId ? FRAMES[frameId] : undefined;
  if (!frameId || !frame) {
    return undefined;
  }

  return {
    frameId,
    frame,
    rawParams: qs.parse(inputUrl.search, {
      ignoreQueryPrefix: true,
    }) as Record<string, unknown>,
  };
}
