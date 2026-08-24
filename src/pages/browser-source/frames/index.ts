import { FrameComponent } from "../frame";
import { participantAvatarFrame } from "./participantAvatar";
import { participantTextFrame } from "./participantText";
import { raceTextFrame } from "./raceText";
import { participantStreamFrame } from "./participantStream";
import { commentatorAvatarFrame } from "./commentatorAvatar";
import { commentatorTextFrame } from "./commentatorText";
import { participantDoubleTextFrame } from "./participantDoubleText";
import { commentatorDoubleTextFrame } from "./commentatorDoubleText";
import { commentatorDiscordFrame } from "./commentatorDiscord";
import { vodPlayerFrame } from "./vodPlayer";
import { tagTextFrame } from "./tagText";
import { compositeFrame } from "./composite";

export const FRAMES: { [frameId: string]: FrameComponent } = {
  tagText: tagTextFrame,
  participantStream: participantStreamFrame,
  participantText: participantTextFrame,
  participantDoubleText: participantDoubleTextFrame,
  participantAvatar: participantAvatarFrame,
  commentatorText: commentatorTextFrame,
  commentatorDoubleText: commentatorDoubleTextFrame,
  commentatorAvatar: commentatorAvatarFrame,
  commentatorDiscord: commentatorDiscordFrame,
  raceText: raceTextFrame,
  vodPlayer: vodPlayerFrame,
  composite: compositeFrame,
};

export {
  COMPOSITE_PADDING,
  encodeCompositeConfig,
  parseCompositeConfig,
} from "./composite";
export type {
  CompositeConfig,
  CompositeConfigV1,
  CompositeFrameConfig,
} from "./composite";
