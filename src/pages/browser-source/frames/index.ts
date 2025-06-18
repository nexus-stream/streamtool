import { FrameComponent } from "../frame";
import { participantAvatarFrame } from "./participantAvatar";
import { debugFrame } from "./debug";
import { participantTextFrame } from "./participantText";
import { raceTextFrame } from "./raceText";
import { participantStreamFrame } from "./stream";
import { commentatorAvatarFrame } from "./commentatorAvatar";
import { commentatorTextFrame } from "./commentatorText";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  participantStream: participantStreamFrame,
  participantText: participantTextFrame,
  participantAvatar: participantAvatarFrame,
  commentatorText: commentatorTextFrame,
  commentatorAvatar: commentatorAvatarFrame,
  raceText: raceTextFrame,
  debug: debugFrame,
};
