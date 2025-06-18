import { FrameComponent } from "../frame";
import { participantAvatarFrame } from "./participantAvatar";
import { debugFrame } from "./debug";
import { participantTextFrame } from "./participantText";
import { raceTextFrame } from "./raceText";
import { participantStreamFrame } from "./stream";
import { commentatorAvatarFrame } from "./commentatorAvatar";
import { commentatorTextFrame } from "./commentatorText";
import { participantDoubleTextFrame } from "./participantDoubleText";
import { commentatorDoubleTextFrame } from "./commentatorDoubleText";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  participantStream: participantStreamFrame,
  participantText: participantTextFrame,
  participantDoubleText: participantDoubleTextFrame,
  participantAvatar: participantAvatarFrame,
  commentatorText: commentatorTextFrame,
  commentatorDoubleText: commentatorDoubleTextFrame,
  commentatorAvatar: commentatorAvatarFrame,
  raceText: raceTextFrame,
  debug: debugFrame,
};
