import { twitchRootSelector } from "./twitchSlice";
import { createSelector } from "@reduxjs/toolkit";

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

export const selectNeedsTwitchAuth = createSelector(
  twitchRootSelector,
  ({ accessToken, expirationEpochTime }) => {
    if (!accessToken) {
      return true;
    }

    if (
      expirationEpochTime &&
      expirationEpochTime < Date.now() + SEVEN_DAYS_MS
    ) {
      return true;
    }

    return false;
  }
);
