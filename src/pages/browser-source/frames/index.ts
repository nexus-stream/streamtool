import { FrameComponent } from "../frame";
import { debugFrame } from "./debug";
import { nameFrame } from "./name";
import { timerFrame } from "./timer";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  participantName: nameFrame,
  raceTimer: timerFrame,
  debug: debugFrame,
};
