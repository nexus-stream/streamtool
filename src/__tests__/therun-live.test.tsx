import { describe, expect, it } from "vitest";
import { render, waitFor, act, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { renderWithProviders, createTestStore } from "../testing/render";
import { RaceLiveUpdater } from "../pages/docked/components/sync/live-update/RaceLiveUpdater";
import { BrowserSourcePage } from "../pages/browser-source/BrowserSourcePage";
import { mockTheRunFetch } from "../testing/fetchMock";
import { lastWebSocket } from "../testing/websocket";
import { upsertRace } from "../data/races/raceSlice";
import { upsertUser } from "../data/users/userSlice";
import { setStage, setCurrentStageId } from "../data/stages/stageSlice";
import {
  raceFixture,
  userFixtures,
  makeParticipant,
  raceStageFixture,
  RACE_ID,
  STAGE_ID,
  PARTICIPANT_1_USER,
  PARTICIPANT_2_USER,
} from "../testing/fixtures";

// Journey: a frame (browser source) updates its text when therun.gg pushes a live
// update over the websocket. Boundary: the WebSocket message, outcome: the visible
// frame text.

function seedStore(store: ReturnType<typeof createTestStore>, race = raceFixture) {
  store.dispatch(setStage(raceStageFixture));
  store.dispatch(setCurrentStageId(STAGE_ID));
  store.dispatch(upsertRace(race));
  for (const user of userFixtures) {
    store.dispatch(upsertUser(user));
  }
}

function renderDockAndFrame(
  store: ReturnType<typeof createTestStore>,
  route: string
) {
  render(
    <Provider store={store}>
      <RaceLiveUpdater raceId={RACE_ID} />
    </Provider>
  );
  return renderWithProviders(<BrowserSourcePage />, {
    store,
    route,
    path: "/frame/:frameId",
  });
}

describe("TheRun live updates", () => {
  it("updates the frame text when therun pushes a race update", async () => {
    const store = createTestStore();
    seedStore(store);
    const users = Object.fromEntries(userFixtures.map((u) => [u.user, u]));
    const fetchMock = mockTheRunFetch(raceFixture, users);

    const frame = renderDockAndFrame(store, "/frame/raceText?kind=game");

    expect(
      await within(frame.container).findByText("Super Mario 64")
    ).toBeInTheDocument();

    // Wait for the mount-time refetch to settle so it can't clobber the update.
    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(3));

    act(() => {
      lastWebSocket().emit("message", {
        data: JSON.stringify({
          type: "raceUpdate",
          data: { ...raceFixture, displayGame: "New Game" },
        }),
      });
    });

    expect(
      await within(frame.container).findByText("New Game")
    ).toBeInTheDocument();
  });

  it("updates the frame text when therun pushes a participant finish", async () => {
    const store = createTestStore();
    const finishedRace = {
      ...raceFixture,
      participants: [
        makeParticipant(PARTICIPANT_1_USER, "finished", { finalTime: 100000 }),
        makeParticipant(PARTICIPANT_2_USER, "joined"),
      ],
    };
    seedStore(store, finishedRace);
    const users = Object.fromEntries(userFixtures.map((u) => [u.user, u]));
    const fetchMock = mockTheRunFetch(finishedRace, users);

    const frame = renderDockAndFrame(
      store,
      "/frame/participantText?participantPosition=1&kind=time"
    );

    // 100000 ms = 1:40
    expect(
      await within(frame.container).findByText("00:01:40")
    ).toBeInTheDocument();

    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(3));

    act(() => {
      lastWebSocket().emit("message", {
        data: JSON.stringify({
          type: "participantUpdate",
          data: makeParticipant(PARTICIPANT_1_USER, "finished", {
            finalTime: 3661000,
          }),
        }),
      });
    });

    // 3661000 ms = 1:01:01
    expect(
      await within(frame.container).findByText("01:01:01")
    ).toBeInTheDocument();
  });
});
