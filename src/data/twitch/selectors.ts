import { twitchRootSelector } from "./twitchSlice";
import { createSelector } from "@reduxjs/toolkit";

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

// When we either don't have a Twitch access token or we're <= seven days
// out from it expiring, treat us as needing Twitch authorization.
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
