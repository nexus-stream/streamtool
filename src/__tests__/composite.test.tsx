import { describe, expect, it } from "vitest";
import { within } from "@testing-library/react";
import { Base64 } from "js-base64";
import {
  CompositeConfig,
  encodeCompositeConfig,
  parseCompositeConfig,
} from "../pages/browser-source/frames";
import { renderWithProviders, createTestStore } from "../testing/render";
import { BrowserSourcePage } from "../pages/browser-source/BrowserSourcePage";
import { updateStage } from "../data/stages/stageSlice";
import { seedRaceStage, STAGE_ID } from "../testing/fixtures";

const FRAME_PATH = "/frame/:frameId";

function renderFrame(store: ReturnType<typeof createTestStore>, route: string) {
  return renderWithProviders(<BrowserSourcePage />, {
    store,
    route,
    path: FRAME_PATH,
  });
}

describe("composite config encoding", () => {
  it("round-trips a v1 layout, including non-ASCII params", () => {
    const config: CompositeConfig = {
      version: 1,
      width: 1280,
      height: 720,
      frames: [
        {
          frameId: "tagText",
          params: { tagName: "eventName", settings: { customFamily: "¡Héllo ☃" } },
          width: 400,
          height: 80,
          x: 10,
          y: 20,
        },
      ],
    };

    expect(parseCompositeConfig(encodeCompositeConfig(config))).toEqual(config);
  });

  it("parses unversioned legacy composite configs and upgrades them to v1", () => {
    const legacyJson = JSON.stringify({
      width: 800,
      height: 600,
      frames: [
        {
          frameId: "tagText",
          params: { tagName: "title" },
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        },
      ],
    });
    const legacyBase64 = Base64.encode(legacyJson);
    expect(parseCompositeConfig(legacyBase64)).toEqual({
      version: 1,
      width: 800,
      height: 600,
      frames: [
        {
          frameId: "tagText",
          params: { tagName: "title" },
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        },
      ],
    });
  });

  it("throws on a malformed config string", () => {
    expect(() => parseCompositeConfig("!!!")).toThrow();
  });
});
describe("composite frame", () => {
  it("renders nested frames positioned on the composite canvas", async () => {
    const store = createTestStore();
    seedRaceStage(store);
    store.dispatch(
      updateStage({
        id: STAGE_ID,
        changes: { tags: { eventName: "GDQ 2024" } },
      })
    );

    const config = encodeCompositeConfig({
      width: 1280,
      height: 720,
      frames: [
        {
          frameId: "tagText",
          params: { tagName: "eventName" },
          width: 400,
          height: 80,
          x: 50,
          y: 60,
        },
      ],
    });

    const frame = renderFrame(
      store,
      `/frame/composite?config=${encodeURIComponent(config)}`
    );

    expect(
      await within(frame.container).findByText("GDQ 2024")
    ).toBeInTheDocument();
  });

  it("falls back to the error message for a malformed config", () => {
    const store = createTestStore();
    const frame = renderFrame(store, "/frame/composite?config=%21%21%21");

    expect(
      within(frame.container).getByText("Invalid composite config")
    ).toBeInTheDocument();
  });

  it("renders non-autoResize frames scaled inside their container", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    const config = encodeCompositeConfig({
      width: 600,
      height: 600,
      frames: [
        {
          frameId: "participantAvatar",
          params: { participantPosition: 1, positionType: "manual" },
          width: 120,
          height: 120,
          x: 10,
          y: 20,
        },
      ],
    });

    const frame = renderFrame(
      store,
      `/frame/composite?config=${encodeURIComponent(config)}`
    );

    const img = await within(frame.container).findByRole("img");
    expect(img).toBeInTheDocument();
    const scaledContainer = img.closest("div[style*='transform']") ?? img.parentElement?.parentElement;
    expect(scaledContainer).toHaveStyle({
      transform: "scale(0.5, 0.5)",
    });
  });
});
