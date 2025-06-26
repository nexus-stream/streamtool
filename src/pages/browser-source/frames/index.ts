import { FrameComponent } from "../frame";
import { participantAvatarFrame } from "./participantAvatar";
import { participantTextFrame } from "./participantText";
import { raceTextFrame } from "./raceText";
import { participantStreamFrame } from "./participantStream";
import { commentatorAvatarFrame } from "./commentatorAvatar";
import { commentatorTextFrame } from "./commentatorText";
import { participantDoubleTextFrame } from "./participantDoubleText";
import { commentatorDoubleTextFrame } from "./commentatorDoubleText";
import { vodPlayerFrame } from "./vodPlayer";
import { tagTextFrame } from "./tagText";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  tagText: tagTextFrame,
  participantStream: participantStreamFrame,
  participantText: participantTextFrame,
  participantDoubleText: participantDoubleTextFrame,
  participantAvatar: participantAvatarFrame,
  commentatorText: commentatorTextFrame,
  commentatorDoubleText: commentatorDoubleTextFrame,
  commentatorAvatar: commentatorAvatarFrame,
  raceText: raceTextFrame,
  vodPlayer: vodPlayerFrame,
};
