import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RefreshAllTabsButton } from "../pages/docked/components/buttons/RefreshAllTabsButton";
import { reloadAllTabs } from "../data/app/appActions";
import { createAppStore } from "../data/storeFactory";

describe("refresh all tabs", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // @ts-expect-error Mocking window.location for reload spy
    delete window.location;
    window.location = {
      ...originalLocation,
      reload: vi.fn(),
    } as unknown as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("triggers reload when button is clicked", async () => {
    const user = userEvent.setup();
    const { store } = createAppStore({ persist: false, syncState: false });

    render(
      <Provider store={store}>
        <RefreshAllTabsButton />
      </Provider>
    );

    expect(window.location.reload).not.toHaveBeenCalled();

    const button = screen.getByRole("button", { name: "Refresh All Tabs" });
    await user.click(button);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("triggers reload when reloadAllTabs action is dispatched directly", () => {
    const { store } = createAppStore({ persist: false, syncState: false });

    expect(window.location.reload).not.toHaveBeenCalled();

    store.dispatch(reloadAllTabs());

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
