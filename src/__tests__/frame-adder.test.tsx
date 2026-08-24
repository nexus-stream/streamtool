import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testing/render";
import { FrameAdderPage } from "../pages/frame-adder/FrameAdderPage";
import { lastObsSocket, OBSWebSocketError } from "../testing/obs";

// Journeys around adding and editing OBS browser sources.
// Boundary: the CreateInput / SetInputSettings / GetInputSettings requests we send
// to OBS, plus the SceneItemSelected event OBS sends back to us.

describe("add a frame to OBS", () => {
  it("creates a browser source in the current scene with the frame's URL", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    socket.respondTo("GetSceneList", () => ({
      currentProgramSceneUuid: "scene-123",
    }));

    await user.click(screen.getByLabelText("Frame"));
    await user.click(await screen.findByRole("option", { name: "Participant Text" }));

    await user.click(
      await screen.findByRole("button", { name: "Insert to Current Scene (bottom)" })
    );

    expect(socket.call).toHaveBeenCalledWith(
      "CreateInput",
      expect.objectContaining({
        sceneUuid: "scene-123",
        inputName: "Participant 1 displayName",
        inputKind: "browser_source",
        inputSettings: expect.objectContaining({
          url: expect.stringContaining("/frame/participantText"),
          width: 420,
          height: 80,
        }),
      })
    );
  });

  it("retries with a suffixed name when the input name collides (601)", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    socket.respondTo("GetSceneList", () => ({
      currentProgramSceneUuid: "scene-123",
    }));

    let createCalls = 0;
    socket.respondTo("CreateInput", () => {
      createCalls += 1;
      if (createCalls === 1) {
        throw new OBSWebSocketError("name in use", 601);
      }
      return {};
    });

    await user.click(screen.getByLabelText("Frame"));
    await user.click(await screen.findByRole("option", { name: "Participant Text" }));
    await user.click(
      await screen.findByRole("button", { name: "Insert to Current Scene (bottom)" })
    );

    await waitFor(() => {
      const createInputCalls = socket.call.mock.calls.filter(
        ([requestType]) => requestType === "CreateInput"
      );
      expect(createInputCalls.length).toBeGreaterThanOrEqual(2);
    });

    const createInputCalls = socket.call.mock.calls.filter(
      ([requestType]) => requestType === "CreateInput"
    );
    const first = createInputCalls[0][1] as { inputName: string };
    const second = createInputCalls[1][1] as { inputName: string };
    expect(second.inputName).not.toBe(first.inputName);
    expect(second.inputName.startsWith(first.inputName)).toBe(true);
  });
});

describe("edit a frame already in OBS", () => {
  it("loads the selected source's config and saves changes back to it", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();

    await user.click(screen.getByRole("tab", { name: "Edit Frame" }));

    socket
      .respondTo("GetSceneItemSource", () => ({
        sourceUuid: "input-1",
        sourceName: "My Frame",
      }))
      .respondTo("GetInputSettings", () => ({
        inputKind: "browser_source",
        inputSettings: {
          url: `${window.location.origin}/frame/participantText?participantPosition=1&positionType=manual&kind=displayName`,
        },
      }))
      .respondTo("SetInputSettings", () => ({}));

    // The user selects the frame's scene item in OBS.
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 42 });

    // The form reflects the selected frame's config.
    expect(await screen.findByDisplayValue("My Frame")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Save to Selected Frame" })
    );

    expect(socket.call).toHaveBeenCalledWith(
      "SetInputSettings",
      expect.objectContaining({
        inputUuid: "input-1",
        inputSettings: expect.objectContaining({
          url: expect.stringContaining("/frame/participantText"),
        }),
      })
    );
  });
});
