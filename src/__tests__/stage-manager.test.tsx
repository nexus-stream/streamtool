import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { DockedPage } from "../pages/docked/DockedPage";
import { StageManagerPage } from "../pages/stage-manager/StageManagerPage";
import { seedRaceStage } from "../testing/fixtures";
import { lastObsSocket } from "../testing/obs";
import { mockTheRunFetch } from "../testing/fetchMock";
import { raceFixture, userFixtures } from "../testing/fixtures";
import { updateTwitchToken } from "../data/twitch/twitchSlice";

describe("DockedPage", () => {
  it("renders status glyphs and opens stage manager on click", async () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const store = createTestStore();
    const user = userEvent.setup();

    renderWithProviders(<DockedPage />, { store });

    const openStageManagerBtn = screen.getByRole("button", {
      name: "Open Stage Manager",
    });
    expect(openStageManagerBtn).toBeInTheDocument();

    await user.click(openStageManagerBtn);
    expect(windowOpenSpy).toHaveBeenCalledWith("/stage-manager", "_blank");

    windowOpenSpy.mockRestore();
  });

  it("renders admin glyph buttons when admin view is active", async () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const store = createTestStore();
    const user = userEvent.setup();

    renderWithProviders(<DockedPage />, { store });

    const addFramesBtn = screen.getByRole("button", { name: "Add Frames" });
    expect(addFramesBtn).toBeInTheDocument();

    await user.click(addFramesBtn);
    expect(windowOpenSpy).toHaveBeenCalledWith("/frame", "_blank");

    const debugBtn = screen.getByRole("button", { name: "View Debug Data" });
    expect(debugBtn).toBeInTheDocument();

    await user.click(debugBtn);
    expect(windowOpenSpy).toHaveBeenCalledWith("/debug", "_blank");

    windowOpenSpy.mockRestore();
  });

  it("displays OBS status indicator and reflects connection state", async () => {
    const store = createTestStore();
    renderWithProviders(<DockedPage />, { store });

    const obsButton = screen.getByRole("button", { name: "OBS Status" });
    expect(obsButton).toBeInTheDocument();

    const socket = lastObsSocket();
    await waitFor(() => expect(socket.isConnected).toBe(true));
  });

  it("displays TheRun websocket status indicator as informative readout", async () => {
    const store = createTestStore();
    const users = Object.fromEntries(userFixtures.map((u) => [u.user, u]));
    mockTheRunFetch(raceFixture, users);

    // When idle (no race stage)
    const { unmount } = renderWithProviders(<DockedPage />, { store });
    expect(screen.getByRole("status", { name: "TheRun: Idle (no active race)" })).toBeInTheDocument();
    unmount();

    // When active race stage exists
    seedRaceStage(store);
    renderWithProviders(<DockedPage />, { store });
    expect(screen.getByRole("status", { name: /TheRun: (Connecting\.\.\.|Connected)/ })).toBeInTheDocument();
  });

  it("allows signing out of Twitch from the debug section", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(updateTwitchToken({ accessToken: "test-token" }));

    renderWithProviders(<DockedPage />, { store });

    const logoutBtn = screen.getByRole("button", { name: "Sign out of Twitch" });
    expect(logoutBtn).toBeInTheDocument();

    await user.click(logoutBtn);
    expect(store.getState().twitch.accessToken).toBeUndefined();
  });
});

describe("StageManagerPage", () => {
  it("renders stage controls, scene switcher buttons, and participant order", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    renderWithProviders(<StageManagerPage />, { store });

    expect(screen.getByLabelText("Current Stage")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Intermission" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Live" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Results" })).toBeInTheDocument();
    expect(screen.getByText("runner_one")).toBeInTheDocument();
  });
});
