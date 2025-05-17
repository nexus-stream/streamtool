import { userAdapter, userRootSelector } from "./userSlice";

export const userSelectors = userAdapter.getSelectors(userRootSelector);
