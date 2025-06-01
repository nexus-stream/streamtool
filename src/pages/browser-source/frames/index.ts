import { FrameComponent } from "../frame";
import { backgroundFrame } from "./background";
import { debugFrame } from "./debug";
import { gameAndCategoryFrame } from "./gameAndCategory";
import { participantNameplateFrame } from "./namePlate";
import { participantStreamFrame } from "./stream";
import { twoPlayerSquareFrame } from "./twoPlayerFull";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  twoPlayerSquare: twoPlayerSquareFrame,
  gameAndCategory: gameAndCategoryFrame,
  participantStream: participantStreamFrame,
  participantNameplate: participantNameplateFrame,
  background: backgroundFrame,
  debug: debugFrame,
};
