import { describe, expect, it, vi } from "vitest";
import { screen, act } from "@testing-library/react";
import { renderWithProviders, createTestStore } from "../testing/render";
import { BrowserSourcePage } from "../pages/browser-source/BrowserSourcePage";
import { upsertRace } from "../data/races/raceSlice";
import {
  seedRaceStage,
  raceFixture,
  makeParticipant,
  PARTICIPANT_1_USER,
  PARTICIPANT_2_USER,
} from "../testing/fixtures";

// Journey: timer frames show a finished runner's time and tick a live race clock.

describe("participant timer frame", () => {
  it("shows a finished participant's final time", async () => {
    const store = createTestStore();
    seedRaceStage(store);
    store.dispatch(
      upsertRace({
        ...raceFixture,
        participants: [
          makeParticipant(PARTICIPANT_1_USER, "finished", { finalTime: 3661000 }),
          makeParticipant(PARTICIPANT_2_USER, "joined"),
        ],
      })
    );

    renderWithProviders(<BrowserSourcePage />, {
      store,
      route: "/frame/participantText?participantPosition=1&kind=time",
      path: "/frame/:frameId",
    });

    // 3661000 ms = 1h 1m 1s
    expect(await screen.findByText("01:01:01")).toBeInTheDocument();
  });
});

describe("race timer frame", () => {
  it("ticks the race timer forward from its start time", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2024-01-01T01:00:00Z"));

      const store = createTestStore();
      seedRaceStage(store);
      store.dispatch(
        upsertRace({ ...raceFixture, startTime: "2024-01-01T00:59:00Z" })
      );

      renderWithProviders(<BrowserSourcePage />, {
        store,
        route: "/frame/raceText?kind=time",
        path: "/frame/:frameId",
      });

      expect(screen.getByText("00:01:00")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText("00:01:02")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
