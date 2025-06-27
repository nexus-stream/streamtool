import { createSelector } from "@reduxjs/toolkit";
import { configRootSelector } from "./configSlice";

export const selectIsAdminView = createSelector(
  configRootSelector,
  ({ isAdmin }) => isAdmin
);

export const selectIsTwitchSyncEnabled = createSelector(
  configRootSelector,
  ({ isTwitchSyncEnabled }) => isTwitchSyncEnabled
);
