import { describe, expect, it } from "vitest";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { EditorPage } from "../pages/editor/EditorPage";
import { BrowserSourcePage } from "../pages/browser-source/BrowserSourcePage";
import { overrideValue } from "../testing/editor";
import { updateStage } from "../data/stages/stageSlice";
import { upsertRace } from "../data/races/raceSlice";
import {
  seedRaceStage,
  raceFixture,
  makeParticipant,
  PARTICIPANT_1_USER,
  STAGE_ID,
} from "../testing/fixtures";

// Journeys where the host edits a value in the editor and a frame (browser source)
// reflects it. Outcome asserted as the visible frame text.

const FRAME_PATH = "/frame/:frameId";

function renderFrame(store: ReturnType<typeof createTestStore>, route: string) {
  return renderWithProviders(<BrowserSourcePage />, {
    store,
    route,
    path: FRAME_PATH,
  });
}

describe("participant text frame", () => {
  it("shows the participant's display name", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    const frame = renderFrame(
      store,
      "/frame/participantText?participantPosition=1&kind=displayName"
    );

    expect(
      await within(frame.container).findByText("runner_one")
    ).toBeInTheDocument();
  });

  it("reflects a display-name override made in the editor", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    seedRaceStage(store);
    // A single participant keeps the "Display Name" field unambiguous.
    store.dispatch(
      upsertRace({
        ...raceFixture,
        participants: [makeParticipant(PARTICIPANT_1_USER, "started")],
      })
    );

    const editor = renderWithProviders(<EditorPage />, { store });
    const frame = renderFrame(
      store,
      "/frame/participantText?participantPosition=1&kind=displayName"
    );

    // Expand the participant's accordion and override its display name.
    await user.click(within(editor.container).getByText("runner_one"));
    await overrideValue(user, "Display Name", "Speedy Runner");

    expect(
      await within(frame.container).findByText("Speedy Runner")
    ).toBeInTheDocument();
  });
});

describe("race text frame", () => {
  it("shows the race's game", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    const frame = renderFrame(store, "/frame/raceText?kind=game");

    expect(
      await within(frame.container).findByText("Super Mario 64")
    ).toBeInTheDocument();
  });

  it("reflects a game override made in the editor", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    seedRaceStage(store);

    renderWithProviders(<EditorPage />, { store });
    const frame = renderFrame(store, "/frame/raceText?kind=game");

    expect(
      await within(frame.container).findByText("Super Mario 64")
    ).toBeInTheDocument();

    await overrideValue(user, "Game", "Custom Game");

    expect(
      await within(frame.container).findByText("Custom Game")
    ).toBeInTheDocument();
  });
});

describe("tag text frame", () => {
  it("shows a tag value from the current stage", async () => {
    const store = createTestStore();
    seedRaceStage(store);
    store.dispatch(
      updateStage({
        id: STAGE_ID,
        changes: { tags: { eventName: "GDQ 2024" } },
      })
    );

    const frame = renderFrame(store, "/frame/tagText?tagName=eventName");

    expect(
      await within(frame.container).findByText("GDQ 2024")
    ).toBeInTheDocument();
  });
});

describe("commentator discord frame", () => {
  it("renders an iframe with the commentator's discord id", async () => {
    const store = createTestStore();
    seedRaceStage(store);
    store.dispatch(
      updateStage({
        id: STAGE_ID,
        changes: {
          raceOverrides: {
            commentators: [
              {
                user: "comm_one",
                discordId: "123456789012345678",
              },
            ],
          },
        },
      })
    );

    const frame = renderFrame(
      store,
      "/frame/commentatorDiscord?commentatorPosition=1"
    );

    const iframe = frame.container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toBe(
      "https://reactive.fugi.tech/basic/123456789012345678"
    );
  });

  it("returns null if commentator has no discord id", async () => {
    const store = createTestStore();
    seedRaceStage(store);
    store.dispatch(
      updateStage({
        id: STAGE_ID,
        changes: {
          raceOverrides: {
            commentators: [
              {
                user: "comm_one",
              },
            ],
          },
        },
      })
    );

    const frame = renderFrame(
      store,
      "/frame/commentatorDiscord?commentatorPosition=1"
    );

    expect(frame.container.querySelector("iframe")).toBeNull();
  });
});

describe("participant stream frame", () => {
  it("renders Twitch embed iframe using profile login", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    const frame = renderFrame(
      store,
      "/frame/participantStream?participantPosition=1"
    );

    const iframe = frame.container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toContain("channel=runner_one");
  });
});
