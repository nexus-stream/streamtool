import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stagesReducer from "./stageSlice";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  stages: stagesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // We share data between the docked page and the pop-out editor / overlays by syncing our
      // redux store between all of the pages. It's a bit ugly, but it keeps things very simple
      // and gives us a lot of flexibility.
      createStateSyncMiddleware({
        blacklist: ["persist/PERSIST", "persist/PURGE", "persist/REHYDRATE"],
      })
    ),
});

initMessageListener(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const rootSelector = (state: RootState) => state;

export const persistor = persistStore(store);

export default store;
