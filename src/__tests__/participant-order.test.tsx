import { describe, expect, it } from "vitest";
import { screen, within, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { Provider } from "react-redux";
import { ParticipantOrder } from "../pages/docked/components/ParticipantOrder";
import { BrowserSourcePage } from "../pages/browser-source/BrowserSourcePage";
import { seedRaceStage } from "../testing/fixtures";

// Journey: the host reorders participants on the dock, which changes which runner
// the frame shows in the first slot.

describe("participant reordering", () => {
  it("swaps two participants and updates the frame's first slot", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    seedRaceStage(store);

    render(
      <Provider store={store}>
        <ParticipantOrder />
      </Provider>
    );
    const frame = renderWithProviders(<BrowserSourcePage />, {
      store,
      route: "/frame/participantText?participantPosition=1&kind=displayName",
      path: "/frame/:frameId",
    });

    // The frame starts on the first participant.
    expect(
      await within(frame.container).findByText("runner_one")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "runner_one" }));
    await user.click(screen.getByRole("button", { name: "runner_two" }));

    // The frame's first slot now shows the swapped-in participant.
    expect(
      await within(frame.container).findByText("runner_two")
    ).toBeInTheDocument();
  });
});
