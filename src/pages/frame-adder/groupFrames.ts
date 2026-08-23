import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import {
  CompositeConfig,
  encodeCompositeConfig,
  parseCompositeConfig,
  FRAMES,
} from "../browser-source/frames";
import {
  buildOBSOverlayURL,
  parseOBSOverlayURL,
} from "../browser-source/overlayUrl";

// Grouping and ungrouping live here rather than in the view so the view only has to
// render a list and call these two operations. Everything is driven by the current
// program scene: we read the scene items that point at our frames, and group/ungroup
// replaces them with a single composite browser source (or the reverse).

const COMPOSITE_FRAME_ID = "composite";
// OBS_ALIGN_TOP_LEFT: place positionX/positionY at the top-left corner, so a child's
// x/y offset from the composite's own position is just position + offset.
const TOP_LEFT_ALIGNMENT = 5;

// A scene item that is one of our frames, resolved to everything grouping needs.
export interface SceneFrame {
  sceneItemId: number;
  sceneUuid: string;
  inputUuid: string;
  inputName: string;
  frameId: string;
  // Absolute top-left corner and size of the item in the OBS canvas (pixels).
  x: number;
  y: number;
  width: number;
  height: number;
  // The frame's raw (still string-typed) params straight from its URL, ready to be
  // re-serialized into a composite child config.
  rawParams: Record<string, unknown>;
  // The decoded layout when this frame is itself a composite (for ungrouping).
  compositeConfig?: CompositeConfig;
}

interface SceneItemTransform {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment?: number;
}

// Replaces the given scene items with a single composite browser source covering
// their bounding box. The originals' scene items and inputs are removed; their config
// and names live on inside the composite so they can be ungrouped later.
export async function groupSceneFrames(
  socket: OBSWebSocket,
  frames: SceneFrame[]
): Promise<void> {
  if (frames.length < 2) {
    return;
  }

  // The scene the selected items live in, taken from the selection event rather than
  // GetSceneList's program scene, which can be null in multi-canvas OBS.
  const sceneUuid = frames[0].sceneUuid;

  const minX = Math.min(...frames.map((f) => f.x));
  const minY = Math.min(...frames.map((f) => f.y));
  const maxX = Math.max(...frames.map((f) => f.x + f.width));
  const maxY = Math.max(...frames.map((f) => f.y + f.height));
  const width = maxX - minX;
  const height = maxY - minY;

  const config: CompositeConfig = {
    width,
    height,
    frames: frames.map((f) => ({
      frameId: f.frameId,
      params: f.rawParams,
      width: f.width,
      height: f.height,
      x: f.x - minX,
      y: f.y - minY,
      name: f.inputName,
    })),
  };

  const url = buildOBSOverlayURL(COMPOSITE_FRAME_ID, {
    config: encodeCompositeConfig(config),
  });

  const { sceneItemId, inputUuid } = await createInputWithRetry(
    socket,
    sceneUuid,
    "Group",
    url,
    width,
    height
  );
  await socket.call("SetSceneItemTransform", {
    sceneUuid,
    sceneItemId,
    sceneItemTransform: {
      positionX: minX,
      positionY: minY,
      width,
      height,
      alignment: TOP_LEFT_ALIGNMENT,
    },
  });

  for (const frame of frames) {
    await socket.call("RemoveSceneItem", {
      sceneUuid,
      sceneItemId: frame.sceneItemId,
    });
    await socket.call("RemoveInput", { inputUuid: frame.inputUuid });
  }
}

// Recreates a composite's children as individual browser sources at their original
// on-screen positions, then removes the composite. Filters and other per-source OBS
// settings are not restored.
export async function ungroupSceneFrame(
  socket: OBSWebSocket,
  frame: SceneFrame
): Promise<void> {
  const config = frame.compositeConfig;
  if (!config) {
    return;
  }

  const sceneUuid = frame.sceneUuid;

  for (const child of config.frames) {
    const url = buildOBSOverlayURL(child.frameId, child.params);
    const childFrame = FRAMES[child.frameId];
    const nativeWidth = childFrame?.displayProperties.width ?? child.width;
    const nativeHeight = childFrame?.displayProperties.height ?? child.height;
    const autoResize = childFrame?.displayProperties.autoResize ?? false;

    const inputWidth = autoResize ? child.width : nativeWidth;
    const inputHeight = autoResize ? child.height : nativeHeight;

    const { sceneItemId } = await createInputWithRetry(
      socket,
      sceneUuid,
      child.name ?? child.frameId,
      url,
      inputWidth,
      inputHeight
    );

    const transform: Record<string, unknown> = {
      positionX: frame.x + child.x,
      positionY: frame.y + child.y,
      alignment: TOP_LEFT_ALIGNMENT,
    };

    if (autoResize) {
      transform.width = child.width;
      transform.height = child.height;
    } else {
      transform.scaleX = child.width / nativeWidth;
      transform.scaleY = child.height / nativeHeight;
    }

    await socket.call("SetSceneItemTransform", {
      sceneUuid,
      sceneItemId,
      sceneItemTransform: transform,
    });
  }

  await socket.call("RemoveSceneItem", {
    sceneUuid,
    sceneItemId: frame.sceneItemId,
  });
  await socket.call("RemoveInput", { inputUuid: frame.inputUuid });
}

export async function resolveSceneFrame(
  socket: OBSWebSocket,
  sceneUuid: string,
  sceneItemId: number
): Promise<SceneFrame | undefined> {
  const item = await socket.call("GetSceneItemSource", { sceneUuid, sceneItemId });

  let input: { inputKind: string; inputSettings: Record<string, unknown> };
  try {
    input = await socket.call("GetInputSettings", { inputUuid: item.sourceUuid });
  } catch {
    // Not an input (a group, nested scene, etc.).
    return undefined;
  }

  const parsed = parseOBSOverlayURL(input.inputSettings, input.inputKind);
  if (!parsed) {
    return undefined;
  }
  const { sceneItemTransform } = await socket.call("GetSceneItemTransform", {
    sceneUuid,
    sceneItemId,
  });
  const bounds = transformToBounds(
    sceneItemTransform as unknown as SceneItemTransform
  );

  const frame: SceneFrame = {
    sceneItemId,
    sceneUuid,
    inputUuid: item.sourceUuid,
    inputName: item.sourceName,
    frameId: parsed.frameId,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    rawParams: parsed.rawParams,
  };

  if (parsed.frameId === COMPOSITE_FRAME_ID) {
    const config = parsed.rawParams.config;
    if (typeof config === "string") {
      try {
        frame.compositeConfig = parseCompositeConfig(config);
      } catch {
        // A malformed composite can't be ungrouped, but shouldn't break the list.
      }
    }
  }

  return frame;
}


async function createInputWithRetry(
  socket: OBSWebSocket,
  sceneUuid: string,
  baseName: string,
  url: string,
  width: number,
  height: number
): Promise<{ inputUuid: string; sceneItemId: number }> {
  const attempt = async (
    name: string,
    retryCount: number
  ): Promise<{ inputUuid: string; sceneItemId: number }> => {
    try {
      const response = await socket.call("CreateInput", {
        sceneUuid,
        inputName: name,
        inputKind: "browser_source",
        inputSettings: { url, width, height },
      });
      return {
        inputUuid: response.inputUuid,
        sceneItemId: response.sceneItemId,
      };
    } catch (e) {
      if (e instanceof OBSWebSocketError && e.code === 601 && retryCount < 3) {
        return attempt(`${name}_${generateNameSuffix()}`, retryCount + 1);
      }
      throw e;
    }
  };

  return attempt(baseName, 0);
}

// Converts an OBS scene item transform into an absolute top-left/size rectangle,
// resolving the alignment anchor. OBS encodes alignment as a bitmask: LEFT=1, RIGHT=2,
// TOP=4, BOTTOM=8.
function transformToBounds(transform: SceneItemTransform) {
  const alignment = transform.alignment ?? 0;
  const horizontal = alignment & 3;
  const vertical = alignment & 12;

  const anchorX = horizontal === 1 ? 0 : horizontal === 2 ? 1 : 0.5;
  const anchorY = vertical === 4 ? 0 : vertical === 8 ? 1 : 0.5;

  return {
    x: transform.positionX - anchorX * transform.width,
    y: transform.positionY - anchorY * transform.height,
    width: transform.width,
    height: transform.height,
  };
}

function generateNameSuffix() {
  return uniqueNamesGenerator({ dictionaries: [animals] });
}
