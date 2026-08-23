import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { EditorPage } from "../pages/editor/EditorPage";
import { mockTheRunFetch } from "../testing/fetchMock";
import { raceFixture, userFixtures } from "../testing/fixtures";

// Journey: the host creates a stage from the editor and sees it appear in the
// stage list. Covers the race, VOD, and tag-only creation paths.

async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Create"));
}

async function fillAndConfirm(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  url?: string
) {
  await user.type(screen.getByLabelText("Name"), name);
  if (url) {
    await user.type(
      screen.getByLabelText("therun.gg URL or Twitch VOD URL (optional)"),
      url
    );
  }
  await user.click(screen.getByRole("button", { name: "Confirm" }));
}

describe("creating stages", () => {
  it("creates a race stage from a therun.gg URL and lists it", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    const users = Object.fromEntries(userFixtures.map((u) => [u.user, u]));
    mockTheRunFetch(raceFixture, users);

    renderWithProviders(<EditorPage />, { store });

    await openCreateModal(user);
    await fillAndConfirm(user, "Main Stage", "https://therun.gg/races/race123");

    expect(await screen.findByText("Main Stage")).toBeInTheDocument();
  });
  it("creates a race stage from a therun.gg URL with hyphens in the race id", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    const hyphenRaceFixture = { ...raceFixture, raceId: "race-123-abc" };
    const users = Object.fromEntries(userFixtures.map((u) => [u.user, u]));
    mockTheRunFetch(hyphenRaceFixture, users);

    renderWithProviders(<EditorPage />, { store });

    await openCreateModal(user);
    await fillAndConfirm(
      user,
      "Hyphen Race Stage",
      "https://therun.gg/races/race-123-abc"
    );

    expect(await screen.findByText("Hyphen Race Stage")).toBeInTheDocument();
  });


  it("creates a VOD stage from a Twitch VOD URL and lists it", async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders(<EditorPage />, { store });

    await openCreateModal(user);
    await fillAndConfirm(
      user,
      "VOD Stage",
      "https://www.twitch.tv/videos/123456789"
    );

    expect(await screen.findByText("VOD Stage")).toBeInTheDocument();
  });

  it("creates a tag-only stage when no URL is given and lists it", async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders(<EditorPage />, { store });

    await openCreateModal(user);
    await fillAndConfirm(user, "Intermission");

    expect(await screen.findByText("Intermission")).toBeInTheDocument();
  });
});
