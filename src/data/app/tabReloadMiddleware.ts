import type { Middleware } from "@reduxjs/toolkit";
import { reloadAllTabs } from "./appActions";

export const tabReloadMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (reloadAllTabs.match(action)) {
    window.location.reload();
  }

  return result;
};
