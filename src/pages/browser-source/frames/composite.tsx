import { css } from "@emotion/react";
import { ReactNode, useMemo } from "react";
import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { FRAMES } from "./index";
import { errorFrame } from "./error";

// A composite frame renders any number of other frames, each positioned absolutely
// within a fixed-size canvas. The entire layout travels as a single base64-encoded
// JSON string in the `config` param; we decode and validate it here.
//
// Composite frames are meant to be built programmatically (encodeCompositeConfig),
// not through the manual frame-adder form, so the whole layout lives behind one
// opaque config param instead of a pile of nested form controls.

const CompositeFrameConfigSchema = z.object({
  frameId: z.string(),
  // The child frame's own configuration, parsed by that frame's zodProps at render
  // time. Left permissive here so the composite doesn't need to know child schemas.
  params: z.record(z.string(), z.unknown()),
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
  x: z.number(),
  y: z.number(),
  // The child's OBS input name, kept so "ungroup" can restore original names. The
  // frame itself ignores this; only the grouping tool reads it.
  name: z.string().optional(),
});

const CompositeConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  frames: z.array(CompositeFrameConfigSchema),
});

export type CompositeFrameConfig = z.infer<typeof CompositeFrameConfigSchema>;
export type CompositeConfig = z.infer<typeof CompositeConfigSchema>;

// btoa/atob only handle Latin-1, so route through a byte string so non-ASCII
// content (names, custom text) survives the round trip.
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function decodeBase64(encoded: string): string {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeCompositeConfig(config: CompositeConfig): string {
  return encodeBase64(JSON.stringify(config));
}

export function parseCompositeConfig(encoded: string): CompositeConfig {
  return CompositeConfigSchema.parse(JSON.parse(decodeBase64(encoded)));
}

export const compositeFrame = buildFrameComponent(
  {
    displayName: "Composite",
    width: 1920,
    height: 1080,
    defaultName: () => "Composite",
  },
  z.object({ config: z.string() }),
  ({ config }) => {
    const decoded = useMemo(() => {
      try {
        return parseCompositeConfig(config);
      } catch {
        return null;
      }
    }, [config]);

    if (!decoded) {
      return <errorFrame.fc message="Invalid composite config" />;
    }

    return (
      <div
        css={css`
          position: relative;
          width: ${decoded.width}px;
          height: ${decoded.height}px;
          overflow: hidden;
        `}
      >
        {decoded.frames.map((frame, index) => renderChild(frame, index))}
      </div>
    );
  }
);

// FRAMES is read at render time only, so it must be fully populated before any
// composite renders. Import composite through frames/index rather than directly;
// the registry builds itself (including this frame) before React mounts anything.
function renderChild(frame: CompositeFrameConfig, key: number): ReactNode {
  const childFrame = FRAMES[frame.frameId];
  const style = css`
    position: absolute;
    left: ${frame.x}px;
    top: ${frame.y}px;
    width: ${frame.width}px;
    height: ${frame.height}px;
    overflow: hidden;
  `;

  if (!childFrame) {
    return (
      <div key={key} css={style}>
        <errorFrame.fc message={`Unknown frame: ${frame.frameId}`} />
      </div>
    );
  }

  const { width: nativeWidth, height: nativeHeight, autoResize } =
    childFrame.displayProperties;
  const shouldScale =
    !autoResize &&
    nativeWidth > 0 &&
    nativeHeight > 0 &&
    (frame.width !== nativeWidth || frame.height !== nativeHeight);

  const content = (() => {
    try {
      const params = childFrame.zodProps.parse(frame.params);
      return <childFrame.fc {...params} />;
    } catch {
      return (
        <errorFrame.fc
          message={`Invalid parameters for frame: ${frame.frameId}`}
        />
      );
    }
  })();

  if (shouldScale) {
    const scaleX = frame.width / nativeWidth;
    const scaleY = frame.height / nativeHeight;
    return (
      <div key={key} css={style}>
        <div
          css={css`
            width: ${nativeWidth}px;
            height: ${nativeHeight}px;
            transform: scale(${scaleX}, ${scaleY});
            transform-origin: top left;
          `}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div key={key} css={style}>
      {content}
    </div>
  );
}
