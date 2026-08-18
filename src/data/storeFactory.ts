import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stageReducer from "./stages/stageSlice";
import raceReducer from "./races/raceSlice";
import userReducer from "./users/userSlice";
import obsReducer from "./obs/obsSlice";
import twitchReducer from "./twitch/twitchSlice";
import configReducer from "./config/configSlice";
import editorReducer from "./editor/editorSlice";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import { persistStore, persistReducer } from "redux-persist";
import type { Storage } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
  stages: stageReducer,
  races: raceReducer,
  users: userReducer,
  obs: obsReducer,
  twitch: twitchReducer,
  config: configReducer,
  editor: editorReducer,
});

export interface AppStoreOptions {
  // Share state between tabs via redux-state-sync. Disable in tests that only
  // need a single tab so we don't spin up a broadcast channel.
  syncState?: boolean;
  // Create the redux-persist persistor (rehydration + flushing to storage).
  // Disable in tests to keep state in-memory and skip the localStorage dance.
  persist?: boolean;
  // Storage backend for redux-persist. Defaults to localStorage.
  storage?: Storage;
}

// Builds the app store. Factored out of store.ts so tests can create isolated,
// side-effect-free instances (no broadcast channel, no rehydration) while the
// production entry point keeps the existing singleton behavior.
//
// The reducer is always wrapped in persistReducer so the state shape is stable
// (including the `_persist` key). persistReducer itself does no storage I/O -
// that only happens in persistStore, which we skip when `persist` is false.
export function createAppStore(options: AppStoreOptions = {}) {
  const {
    syncState = true,
    persist = true,
    storage: storageOverride = storage,
  } = options;

  const reducer = persistReducer(
    {
      key: "root",
      storage: storageOverride,
      // We don't want to persist the editor state between instances.
      blacklist: ["editor"],
    },
    rootReducer
  );

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "persist/PERSIST",
            "persist/PURGE",
            "persist/REHYDRATE",
          ],
        },
      });

      if (syncState) {
        // We share data between the docked page and the pop-out editor / overlays
        // by syncing our redux store between all of the pages. It's a bit ugly,
        // but it keeps things very simple and gives us a lot of flexibility.
        return middleware.concat(
          createStateSyncMiddleware({
            blacklist: ["persist/PERSIST", "persist/PURGE", "persist/REHYDRATE"],
          })
        );
      }

      return middleware;
    },
  });

  if (syncState) {
    initMessageListener(store);
  }

  const persistor = persist ? persistStore(store) : undefined;

  return { store, persistor };
}

export type AppStore = ReturnType<typeof createAppStore>;
