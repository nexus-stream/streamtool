import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestStore } from "../testing/render";
import { ObsWebSocketProvider } from "../data/obs/ObsWebSocketProvider";
import { ObsDataSync } from "../pages/docked/components/sync/ObsDataSync";
import { AdvancedSceneSwitcherMessageButton } from "../pages/docked/components/buttons/AdvancedSceneSwitcherMessageButton";
import { lastObsSocket } from "../testing/obs";
import { seedRaceStage } from "../testing/fixtures";

// Journey: current stage data flows to Advanced Scene Switcher through OBS.
// Boundary: the CallVendorRequest message the app sends over the websocket.

describe("OBS data sync", () => {
  it("sends flattened current-stage data to Advanced Scene Switcher", async () => {
    const store = createTestStore();
    seedRaceStage(store);

    renderWithProviders(
      <ObsWebSocketProvider>
        <ObsDataSync />
      </ObsWebSocketProvider>,
      { store }
    );

    const socket = lastObsSocket();
    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CallVendorRequest",
        expect.objectContaining({
          vendorName: "AdvancedSceneSwitcher",
          requestType: "AdvancedSceneSwitcherMessage",
          requestData: expect.objectContaining({
            message: expect.stringContaining("streamtool flat data"),
          }),
        })
      );
    });

    // The payload carries the display data a scene-switcher macro would read.
    const message = socket.call.mock.calls[0][1] as {
      requestData: { message: string };
    };
    expect(message.requestData.message).toContain("Super Mario 64");
    expect(message.requestData.message).toContain("Main Stage");
  });
});

describe("Advanced Scene Switcher event buttons", () => {
  it("emits a vendor event for intermission/live/results", async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders(
      <ObsWebSocketProvider>
        <AdvancedSceneSwitcherMessageButton name="intermission">
          Intermission
        </AdvancedSceneSwitcherMessageButton>
      </ObsWebSocketProvider>,
      { store }
    );

    const socket = lastObsSocket();
    await waitFor(() => expect(socket.isConnected).toBe(true));

    await user.click(screen.getByRole("button", { name: "Intermission" }));

    expect(socket.call).toHaveBeenCalledWith(
      "CallVendorRequest",
      expect.objectContaining({
        requestData: { message: "streamtool event: intermission" },
      })
    );
  });
});
