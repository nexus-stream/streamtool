import { FrameComponent } from "../frame";
import { nameFrame } from "./name";
import { timerFrame } from "./timer";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  participantName: nameFrame,
  raceTimer: timerFrame,
};
