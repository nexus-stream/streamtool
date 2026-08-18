import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import type { ReactElement, ReactNode } from "react";
import { createAppStore } from "../data/storeFactory";
import type { AppStore } from "../data/storeFactory";

export type TestStore = AppStore["store"];

// A store with no persistence and no cross-tab sync - the right default for
// single-tab journey tests. Cross-tab tests build their own two synced stores.
export function createTestStore(): TestStore {
  return createAppStore({ persist: false, syncState: false }).store;
}

interface RenderOptions {
  store?: TestStore;
  route?: string;
  // Route pattern to match the component against (needed for useParams). When
  // omitted, children render directly without a route match.
  path?: string;
}

// Renders a component with the providers it needs: a Redux store and a router.
// Pages that talk to OBS wrap themselves in ObsWebSocketProvider, so we don't do
// that here - but it means tests must seed obs credentials before mounting them.
export function renderWithProviders(
  ui: ReactElement,
  { store = createTestStore(), route = "/", path }: RenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {path ? (
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...rtlRender(ui, { wrapper: Wrapper }) };
}
