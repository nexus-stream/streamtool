import { createAppStore } from "./storeFactory";

const created = createAppStore();
const store = created.store;
// The production singleton always persists, so the persistor is always defined.
const persistor = created.persistor!;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const rootSelector = (state: RootState) => state;

export { persistor };
export default store;
