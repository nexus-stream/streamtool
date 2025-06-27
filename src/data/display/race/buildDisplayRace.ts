import { Race } from "../../races/types";
import { User } from "../../users/types";
import { DisplayRace } from "./types";
import { DISPLAY_RACE_FIELDS } from "./displayRaceFields";

export function buildDisplayRace(
  race: Race,
  userEntities: Record<string, User>
): DisplayRace {
  const builtValue: { [key: string]: unknown } = {};
  for (const key in DISPLAY_RACE_FIELDS) {
    const typedKey = key as keyof DisplayRace;
    builtValue[typedKey] = DISPLAY_RACE_FIELDS[typedKey](race, userEntities);
  }

  // We do some hardcore Typescript lying here. This relies on
  // DISPLAY_RACE_FIELDS's typing forcing it to have entries
  // for every key in DisplayRace.
  return builtValue as unknown as DisplayRace;
}
