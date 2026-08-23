import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testing/render";
import { FrameAdderPage } from "../pages/frame-adder/FrameAdderPage";
import { lastObsSocket, OBSWebSocketError } from "../testing/obs";
import {
  encodeCompositeConfig,
  parseCompositeConfig,
} from "../pages/browser-source/frames";
import { parseOBSOverlayURL } from "../pages/browser-source/overlayUrl";

// Journeys for the "Group" tab. obs-websocket has no multi-select read, so the tab
// accumulates SceneItemSelected events as the user clicks frames in OBS, then groups
// the accumulated set. Boundary: the CreateInput / SetSceneItemTransform
// / Remove* requests we send to OBS.

const ORIGIN = window.location.origin;

// Shared canned responses for a scene with two regular frames (ids 1 and 2) plus a
// composite frame (id 3). GetSceneItemSource/GetInputSettings/GetSceneItemTransform
// dispatch on sceneItemId.
function respondToSceneItems(socket: ReturnType<typeof lastObsSocket>) {
  socket
    .respondTo("GetSceneItemSource", (data) => {
      const { sceneItemId } = data as { sceneItemId: number };
      if (sceneItemId === 1) {
        return { sourceUuid: "input-1", sourceName: "Frame A" };
      }
      if (sceneItemId === 2) {
        return { sourceUuid: "input-2", sourceName: "Frame B" };
      }
      if (sceneItemId === 4) {
        return { sourceUuid: "avatar-composite-input", sourceName: "Avatar Group" };
      }
      return { sourceUuid: "group-input", sourceName: "Group" };
    })
    .respondTo("GetInputSettings", (data) => {
      const { inputUuid } = data as { inputUuid: string };
      if (inputUuid === "input-1") {
        return {
          inputKind: "browser_source",
          inputSettings: {
            url: `${ORIGIN}/frame/participantText?participantPosition=1&positionType=manual&kind=displayName`,
          },
        };
      }
      if (inputUuid === "input-2") {
        return {
          inputKind: "browser_source",
          inputSettings: {
            url: `${ORIGIN}/frame/tagText?tagName=eventName`,
          },
        };
      }
      if (inputUuid === "avatar-composite-input") {
        return {
          inputKind: "browser_source",
          inputSettings: {
            url: `${ORIGIN}/frame/composite?config=${encodeURIComponent(
              encodeCompositeConfig({
                width: 120,
                height: 120,
                frames: [
                  {
                    frameId: "participantAvatar",
                    params: { participantPosition: "1", positionType: "manual" },
                    width: 120,
                    height: 120,
                    x: 0,
                    y: 0,
                    name: "Avatar",
                  },
                ],
              })
            )}`,
          },
        };
      }
      return {
        inputKind: "browser_source",
        inputSettings: {
          url: `${ORIGIN}/frame/composite?config=${encodeURIComponent(compositeConfigUrl())}`,
        },
      };
    })
    .respondTo("GetSceneItemTransform", (data) => {
      const { sceneItemId } = data as { sceneItemId: number };
      if (sceneItemId === 1) {
        return {
          sceneItemTransform: {
            positionX: 100,
            positionY: 100,
            width: 420,
            height: 80,
            alignment: 5,
          },
        };
      }
      if (sceneItemId === 2) {
        return {
          sceneItemTransform: {
            positionX: 100,
            positionY: 200,
            width: 420,
            height: 80,
            alignment: 5,
          },
        };
      }
      return {
        sceneItemTransform: {
          positionX: 100,
          positionY: 50,
          width: 500,
          height: 300,
          alignment: 5,
        },
      };
    })
    .respondTo("CreateInput", () => ({
      inputUuid: "created-input",
      sceneItemId: 99,
    }))
    .respondTo("SetSceneItemTransform", () => ({}))
    .respondTo("SetSceneItemEnabled", () => ({}))
    .respondTo("RemoveSceneItem", () => ({}))
    .respondTo("RemoveInput", () => ({}));
}

function compositeConfigUrl(): string {
  return encodeCompositeConfig({
    width: 500,
    height: 300,
    frames: [
      {
        frameId: "participantText",
        params: {
          participantPosition: "1",
          positionType: "manual",
          kind: "displayName",
        },
        width: 200,
        height: 50,
        x: 0,
        y: 0,
        name: "Runner Name",
      },
      {
        frameId: "tagText",
        params: { tagName: "eventName" },
        width: 200,
        height: 50,
        x: 0,
        y: 100,
        name: "Event Tag",
      },
    ],
  });
}

describe("group frames selected in OBS", () => {
  it("accumulates selected frames and groups them at their bounding box", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    expect(
      screen.getByText("Select frames in OBS to add them to the group.")
    ).toBeInTheDocument();

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 2 });

    expect(await screen.findByText(/Frame A/)).toBeInTheDocument();
    expect(await screen.findByText(/Frame B/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Group" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: "Group",
          inputKind: "browser_source",
          inputSettings: expect.objectContaining({
            url: expect.stringContaining("/frame/composite"),
            width: 452,
            height: 212,
          }),
        })
      );
    });

    expect(socket.call).toHaveBeenCalledWith(
      "SetSceneItemTransform",
      expect.objectContaining({
        sceneItemId: 99,
        sceneItemTransform: expect.objectContaining({
          positionX: 4, // 100 - COMPOSITE_PADDING(16) - 80
          positionY: 164, // 100 - COMPOSITE_PADDING(16) + 80
          width: 452,
          height: 212,
          alignment: 5,
        }),
      })
    );

    // The composite records each child's relative offset and original name.
    const createInputCalls = socket.call.mock.calls.filter(
      ([requestType]) => requestType === "CreateInput"
    );
    const compositeCreate = createInputCalls.find(
      ([, data]) => (data as { inputName?: string }).inputName === "Group"
    )!;
    const { inputSettings } = compositeCreate[1] as {
      inputSettings: { url: string };
    };
    const parsed = parseOBSOverlayURL(inputSettings, "browser_source")!;
    const config = parseCompositeConfig(parsed.rawParams.config as string);
    expect(config).toEqual({
      version: 1,
      width: 452,
      height: 212,
      frames: [
        {
          frameId: "participantText",
          params: {
            participantPosition: "1",
            positionType: "manual",
            kind: "displayName",
          },
          width: 420,
          height: 80,
          x: 0,
          y: 0,
          name: "Frame A",
        },
        {
          frameId: "tagText",
          params: { tagName: "eventName" },
          width: 420,
          height: 80,
          x: 0,
          y: 100,
          name: "Frame B",
        },
      ],
    });
    expect(socket.call).not.toHaveBeenCalledWith(
      "RemoveSceneItem",
      expect.objectContaining({ sceneItemId: 1 })
    );
    expect(socket.call).not.toHaveBeenCalledWith(
      "RemoveSceneItem",
      expect.objectContaining({ sceneItemId: 2 })
    );
    expect(socket.call).not.toHaveBeenCalledWith(
      "RemoveInput",
      expect.objectContaining({ inputUuid: "input-1" })
    );
    expect(socket.call).not.toHaveBeenCalledWith(
      "RemoveInput",
      expect.objectContaining({ inputUuid: "input-2" })
    );
  });

  it("allows specifying a custom name for the group", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 2 });

    await screen.findByText(/Frame A/);
    await screen.findByText(/Frame B/);

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toHaveValue("Group");

    await user.clear(nameInput);
    await user.type(nameInput, "Custom Group Name");

    await user.click(screen.getByRole("button", { name: "Group" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: "Custom Group Name",
        })
      );
    });
  });

  it("dedupes group name if a collision occurs on creation", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    let createCount = 0;
    socket.respondTo("CreateInput", (data) => {
      const { inputName } = data as { inputName: string };
      if (inputName.startsWith("Group")) {
        createCount++;
        if (createCount === 1) {
          throw new OBSWebSocketError("name in use", 601);
        }
        return { inputUuid: "created-group-input", sceneItemId: 99 };
      }
      return { inputUuid: "created-input", sceneItemId: 99 };
    });

    await user.click(screen.getByRole("tab", { name: "Group" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 2 });

    await screen.findByText(/Frame A/);
    await screen.findByText(/Frame B/);

    await user.click(screen.getByRole("button", { name: "Group" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: expect.stringMatching(/^Group_/),
        })
      );
    });
  });

  it("lets the user remove a frame from the group before grouping", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 2 });

    await screen.findByText(/Frame A/);
    await screen.findByText(/Frame B/);

    await user.click(screen.getAllByRole("button", { name: "Remove" })[0]);

    await waitFor(() => {
      expect(screen.queryByText(/Frame A/)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Frame B/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Group" })).toBeDisabled();
  });

  it("clears accumulated frames when the Clear button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 2 });

    await screen.findByText(/Frame A/);
    await screen.findByText(/Frame B/);

    await user.click(screen.getByRole("button", { name: "Clear" }));

    await waitFor(() => {
      expect(screen.queryByText(/Frame A/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Frame B/)).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Select frames in OBS to add them to the group.")
    ).toBeInTheDocument();
  });

  it("clears accumulated frames when switching active scenes in OBS", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 1 });
    await screen.findByText(/Frame A/);

    socket.emit("CurrentProgramSceneChanged", { sceneName: "Other Scene" });

    await waitFor(() => {
      expect(screen.queryByText(/Frame A/)).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Select frames in OBS to add them to the group.")
    ).toBeInTheDocument();
  });

  it("ignores composite frames when selected in the Group tab", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Group" }));

    // Item 3 is a composite frame
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 3 });

    expect(
      screen.getByText("Select frames in OBS to add them to the group.")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Composite/)).not.toBeInTheDocument();
  });
});

describe("ungroup a composite frame", () => {
  it("recreates the children at their original positions and names", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Ungroup" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 3 });

    expect(await screen.findByText(/Composite/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ungroup" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: "Runner Name",
          inputKind: "browser_source",
          inputSettings: expect.objectContaining({
            url: expect.stringContaining("/frame/participantText"),
            width: 200,
            height: 50,
          }),
        })
      );
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: "Event Tag",
          inputSettings: expect.objectContaining({
            url: expect.stringContaining("/frame/tagText"),
          }),
        })
      );
    });
    expect(socket.call).toHaveBeenCalledWith(
      "SetSceneItemTransform",
      expect.objectContaining({
        sceneItemTransform: expect.objectContaining({
          positionX: 116,
          positionY: 66,
          width: 200,
          height: 50,
        }),
      })
    );
    expect(socket.call).toHaveBeenCalledWith(
      "SetSceneItemTransform",
      expect.objectContaining({
        sceneItemTransform: expect.objectContaining({
          positionX: 116,
          positionY: 166,
          width: 200,
          height: 50,
        }),
      })
    );

    expect(socket.call).toHaveBeenCalledWith(
      "RemoveSceneItem",
      expect.objectContaining({ sceneItemId: 3 })
    );
    expect(socket.call).toHaveBeenCalledWith(
      "RemoveInput",
      expect.objectContaining({ inputUuid: "group-input" })
    );
  });

  it("queries the live position of the composite at ungroup time if moved after selection", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Ungroup" }));

    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 3 });
    expect(await screen.findByText(/Composite/)).toBeInTheDocument();

    // Simulate moving the composite in OBS before clicking Ungroup
    socket.respondTo("GetSceneItemTransform", (data) => {
      const { sceneItemId } = data as { sceneItemId: number };
      if (sceneItemId === 3) {
        return {
          sceneItemTransform: {
            positionX: 500,
            positionY: 400,
            width: 500,
            height: 300,
            alignment: 5,
          },
        };
      }
      return { sceneItemTransform: { positionX: 0, positionY: 0, width: 100, height: 100, alignment: 5 } };
    });

    await user.click(screen.getByRole("button", { name: "Ungroup" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "SetSceneItemTransform",
        expect.objectContaining({
          sceneItemTransform: expect.objectContaining({
            positionX: 516, // 500 + COMPOSITE_PADDING(16) + child.x(0)
            positionY: 416, // 400 + COMPOSITE_PADDING(16) + child.y(0)
          }),
        })
      );
    });
  });

  it("retries with a suffixed name if a restored child input name collides", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    let createCount = 0;
    socket.respondTo("CreateInput", () => {
      createCount++;
      if (createCount === 1) {
        throw new OBSWebSocketError("name in use", 601);
      }
      return {
        inputUuid: `created-input-${createCount}`,
        sceneItemId: 100 + createCount,
      };
    });

    await user.click(screen.getByRole("tab", { name: "Ungroup" }));
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 3 });

    expect(await screen.findByText(/Composite/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ungroup" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: expect.stringMatching(/^Runner Name_/),
        })
      );
    });
  });

  it("recreates non-autoResize children with native canvas size and scale", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FrameAdderPage />);
    const socket = lastObsSocket();
    respondToSceneItems(socket);

    await user.click(screen.getByRole("tab", { name: "Ungroup" }));
    socket.emit("SceneItemSelected", { sceneUuid: "scene-1", sceneItemId: 4 });

    expect(await screen.findByText(/Composite/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ungroup" }));

    await waitFor(() => {
      expect(socket.call).toHaveBeenCalledWith(
        "CreateInput",
        expect.objectContaining({
          sceneUuid: "scene-1",
          inputName: "Avatar",
          inputKind: "browser_source",
          inputSettings: expect.objectContaining({
            url: expect.stringContaining("/frame/participantAvatar"),
            width: 240,
            height: 240,
          }),
        })
      );
    });

    expect(socket.call).toHaveBeenCalledWith(
      "SetSceneItemTransform",
      expect.objectContaining({
        sceneItemTransform: expect.objectContaining({
          scaleX: 0.5,
          scaleY: 0.5,
        }),
      })
    );
  });
});
