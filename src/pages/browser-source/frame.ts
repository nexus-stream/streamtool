import { RaceInfo } from "../../data/types";

export interface FrameProps {
  race: RaceInfo;
  participantIndex?: number;
}

export interface Frame {
  fc: React.FC<FrameProps>;
  frameId: string;
  displayName: string;
}
