import { FrameComponent } from "../frame";
import { backgroundFrame } from "./background";
import { debugFrame } from "./debug";
import { gameAndCategoryFrame } from "./gameAndCategory";
import { participantNameplateFrame } from "./namePlate";
import { participantStreamFrame } from "./stream";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  gameAndCategory: gameAndCategoryFrame,
  participantStream: participantStreamFrame,
  participantNameplate: participantNameplateFrame,
  background: backgroundFrame,
  debug: debugFrame,
};
