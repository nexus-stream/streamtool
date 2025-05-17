import { DisplayRace } from "../../data/stages/types";

export interface FrameProps {
  race: DisplayRace;
  participantIndex?: number;
}

export interface Frame {
  fc: React.FC<FrameProps>;
  frameId: string;
  displayName: string;
}
