import { DisplayRace } from "../../../data/display/types";

interface Props {
  race: DisplayRace;
}

export function RaceGameAndCategory({ race }: Props) {
  return (
    <div className="flex flex-col align-middle justify-center text-center bg-indigo-800 p-2 h-full rounded-md text-2xl font-bold">
      <p>{race.game}</p>
      <p>{race.category}</p>
    </div>
  );
}
