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

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    // We don't want to persist the editor state between instances.
    blacklist: ["editor"],
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REHYDRATE",
        ],
      },
    }).concat(
      // We share data between the docked page and the pop-out editor / overlays by syncing our
      // redux store between all of the pages. It's a bit ugly, but it keeps things very simple
      // and gives us a lot of flexibility.
      createStateSyncMiddleware({
        blacklist: ["persist/PERSIST", "persist/PURGE", "persist/REHYDRATE"],
      })
    ),
});

initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const rootSelector = (state: RootState) => state;

export const persistor = persistStore(store);

export default store;
