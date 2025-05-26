import { Action } from "@reduxjs/toolkit";
import { DisplayRace, RaceOverrides } from "../../../../data/stages/types";

interface Props<TValue> {
  valueSelector: (race: DisplayRace) => TValue;
  overrideSelector: (overrides: RaceOverrides) => TValue | undefined;
  buildSetOverrideAction: (
    stageId: string,
    value: TValue | undefined
  ) => Action;
}

export function buildEditorBackingHook<TValue>({
  valueSelector,
  overrideSelector,
  buildSetOverrideAction,
}: Props<TValue>) {}
