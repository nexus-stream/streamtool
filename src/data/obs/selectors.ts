import { createSelector } from "@reduxjs/toolkit";
import { obsRootSelector } from "./obsSlice";

export const selectObsCredentials = createSelector(obsRootSelector, (state) => {
  return {
    port: state.port,
    password: state.password,
    loginTime: state.loginTime,
  };
});
