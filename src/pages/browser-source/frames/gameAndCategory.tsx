import { RaceGameAndCategory } from "../components/RaceGameAndCategory";
import { buildFrameComponent } from "../frame";

export const gameAndCategoryFrame = buildFrameComponent(
  {
    displayName: "Game and Category",
    width: 400,
    height: 100,
  },
  ({ race }) => {
    return <RaceGameAndCategory race={race} />;
  }
);
