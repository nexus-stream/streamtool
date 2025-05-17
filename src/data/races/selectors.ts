import { raceAdapter, raceRootSelector } from "./raceSlice";

export const raceSelectors = raceAdapter.getSelectors(raceRootSelector);
