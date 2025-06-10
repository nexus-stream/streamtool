import { FrameComponent } from "../frame";
import { avatarFrame } from "./avatar";
import { debugFrame } from "./debug";
import { participantTextFrame } from "./participantText";
import { raceTextFrame } from "./raceText";
import { participantStreamFrame } from "./stream";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  participantStream: participantStreamFrame,
  participantText: participantTextFrame,
  avatar: avatarFrame,
  raceText: raceTextFrame,
  debug: debugFrame,
};
