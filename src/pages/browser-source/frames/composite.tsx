import { Base64 } from "js-base64";
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

export interface CompositeFrameConfig {
  frameId: string;
  params: Record<string, unknown>;
  width: number;
  height: number;
  x: number;
  y: number;
  name?: string;
}

export interface CompositeConfigV1 {
  version: 1;
  width: number;
  height: number;
  frames: CompositeFrameConfig[];
}

export type CompositeConfigInput = {
  version?: 1;
  width: number;
  height: number;
  frames: CompositeFrameConfig[];
};

export type CompositeConfig = CompositeConfigV1;
const CompositeFrameConfigSchema: z.ZodType<CompositeFrameConfig> = z.object({
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

// Schema supporting both unversioned legacy configs and version 1.
const CompositeConfigSchema = z
  .object({
    version: z.literal(1).optional(),
    width: z.number().positive(),
    height: z.number().positive(),
    frames: z.array(CompositeFrameConfigSchema),
  })
  .transform(
    (data): CompositeConfigV1 => ({
      version: 1,
      width: data.width,
      height: data.height,
      frames: data.frames,
    }),
  );

export const COMPOSITE_PADDING = 16;

export function encodeCompositeConfig(config: CompositeConfigInput): string {
  const payload: CompositeConfigV1 = {
    ...config,
    version: 1,
  };
  return Base64.encode(JSON.stringify(payload));
}

export function parseCompositeConfig(encoded: string): CompositeConfig {
  return CompositeConfigSchema.parse(JSON.parse(Base64.decode(encoded)));
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
  },
);

// FRAMES is read at render time only, so it must be fully populated before any
// composite renders. Import composite through frames/index rather than directly;
// the registry builds itself (including this frame) before React mounts anything.
function renderChild(frame: CompositeFrameConfig, key: number): ReactNode {
  const childFrame = FRAMES[frame.frameId];
  const style = css`
    position: absolute;
    left: ${frame.x + COMPOSITE_PADDING}px;
    top: ${frame.y + COMPOSITE_PADDING}px;
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

  const {
    width: nativeWidth,
    height: nativeHeight,
    autoResize,
  } = childFrame.displayProperties;
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
