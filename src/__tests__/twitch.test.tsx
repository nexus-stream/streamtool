import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { EditorPage } from "../pages/editor/EditorPage";
import { StageSelector } from "../pages/docked/components/StageSelector";
import { TwitchSync } from "../pages/docked/components/sync/TwitchSync";
import { TwitchWebhookPage } from "../pages/twitch-webhook/TwitchWebhookPage";
import { editStageValue } from "../testing/editor";
import { mockTwitchFetch, TWITCH_VALIDATE_URL } from "../testing/fetchMock";
import { updateTwitchToken } from "../data/twitch/twitchSlice";
import { setIsTwitchSyncEnabled } from "../data/config/configSlice";

// Journeys at the Twitch boundary. Connecting stores the OAuth token; the stream
// sync journey starts on the editor, gives a stage a title + game, and switching to
// that stage on the dock triggers the Twitch channel update.

describe("connect to Twitch", () => {
  it("validates the OAuth token and stores the broadcaster", async () => {
    const store = createTestStore();
    const fetchMock = mockTwitchFetch();

    window.location.hash = "access_token=abc123";
    vi.spyOn(window, "close").mockImplementation(() => {});

    renderWithProviders(<TwitchWebhookPage />, { store });

    await waitFor(() => {
      expect(store.getState().twitch.accessToken).toBe("abc123");
    });

    expect(store.getState().twitch.login).toBe("broadcaster");
    expect(fetchMock).toHaveBeenCalledWith(
      TWITCH_VALIDATE_URL,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer abc123" }),
      })
    );
  });
});

describe("Twitch stream sync", () => {
  it("updates Twitch when the host switches to a stage with a title and game", async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    // Setup: already connected to Twitch with sync enabled (the connect journey is
    // covered above).
    store.dispatch(updateTwitchToken({ accessToken: "abc123" }));
    store.dispatch(setIsTwitchSyncEnabled(true));

    const twitchFetch = mockTwitchFetch({
      categories: () => ({ data: [{ id: "game-1", name: "Super Mario 64" }] }),
    });

    // Editor: create a stage and give it a title + game. No URL means a tag-only
    // stage, which avoids a therun fetch.
    renderWithProviders(<EditorPage />, { store });
    await user.click(screen.getByText("Create"));
    await user.type(screen.getByLabelText("Name"), "Main Stage");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    // Select the new stage in the editor list, then edit its title and game.
    await user.click(await screen.findByText("Main Stage"));
    await screen.findByLabelText("Stream Title");
    await editStageValue(user, "Stream Title", "My Title");

    const gameInput = screen.getByLabelText("Twitch Game Name");
    await user.click(gameInput);
    await user.type(gameInput, "Super Mario");
    await user.click(await screen.findByRole("option", { name: "Super Mario 64" }));

    // Dock: switch to the new stage.
    render(
      <Provider store={store}>
        <StageSelector />
        <TwitchSync />
      </Provider>
    );
    await user.click(screen.getByLabelText("Current Stage"));
    await user.click(await screen.findByRole("option", { name: "Main Stage" }));

    // The Twitch channel update goes out with the stage's title + game id.
    await waitFor(() => {
      const channelCall = twitchFetch.mock.calls.find(([url]) =>
        String(url).includes("/helix/channels")
      );
      expect(channelCall).toBeDefined();
    });

    const [, init] = twitchFetch.mock.calls.find(([url]) =>
      String(url).includes("/helix/channels")
    ) as [unknown, RequestInit];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      game_id: "game-1",
      title: "My Title",
    });
  });
});
