import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testing/render";
import { ObsConnectPage } from "../pages/obs-connect/ObsConnectPage";
import { FakeObsSocket } from "../testing/obs";

// Journey: host connects the tool to OBS's websocket server.
// Boundary: the obs-websocket-js connection itself - we assert on the exact
// connect() the app makes and drive success/failure through the fake.

describe("connect to OBS", () => {
  it("retries with new credentials after the initial connection fails", async () => {
    const user = userEvent.setup();

    // The provider immediately attempts a connection with the stored (default)
    // credentials. Make that first attempt fail, as it would with no OBS running.
    FakeObsSocket.connectBehavior = async () => {
      throw new Error("connection refused");
    };

    renderWithProviders(<ObsConnectPage />);

    // The failed attempt surfaces the login form with an error.
    expect(
      await screen.findByText("Log in to OBS Websocket Server")
    ).toBeInTheDocument();
    expect(screen.getByText(/Login failed/)).toBeInTheDocument();

    const firstSocket = FakeObsSocket.instances[0];
    expect(firstSocket.connect).toHaveBeenCalledWith(
      "ws://127.0.0.1:4455",
      "",
      expect.anything()
    );

    // The user enters the real password and retries.
    FakeObsSocket.connectBehavior = async () => {};
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Connected to OBS")).toBeInTheDocument();

    // The retry used the updated credentials on a fresh connection.
    const secondSocket = FakeObsSocket.instances[1];
    expect(secondSocket.connect).toHaveBeenCalledWith(
      "ws://127.0.0.1:4455",
      "secret",
      expect.anything()
    );
  });
});
