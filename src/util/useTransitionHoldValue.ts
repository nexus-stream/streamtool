import { css } from "@emotion/react";
import { useState, useEffect } from "react";

// This needs to stay consistent across the UI or it's gonna look ugly.
const TRANSITION_LENGTH = 500;

// When data changes, we want to nicely transition the old value to the new one. This
// holds the previous value in the component during that transition period (currently
// hardcoded to 500ms) so we keep the old value while fading out.
//
// It is not enough to just do this when value changes, because we still want to show
// a transition if a value is the same between one stage and another (ex. if the same
// player is in the first slot in both), and we do not always want to show a transition
// on every change (ex. timers).
//
// Because of this, we take a "holdKey" value as well, which will usually either be or
// be built from the stage id. This determines when the hook is triggered and we hold
// the previous value for TRANSITION_LENGTH ms.
export function useTransitionHoldValue<TValue>(
  value: TValue,
  holdKey: string
): [TValue, boolean] {
  const [currentHoldKey, setCurrentHoldKey] = useState(holdKey);
  const [displayValues, setDisplayValues] = useState<{
    [holdKey: string]: TValue;
  }>(() => ({ [holdKey]: value }));
  const [isHoldingValue, setIsHoldingValue] = useState(false);

  useEffect(() => {
    setDisplayValues((old) => ({ ...old, [holdKey]: value }));
  }, [holdKey, value]);

  useEffect(() => {
    if (isHoldingValue) {
      return;
    }

    if (holdKey !== currentHoldKey) {
      setIsHoldingValue(true);
    }
  }, [currentHoldKey, holdKey, isHoldingValue]);

  useEffect(() => {
    if (!isHoldingValue) {
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentHoldKey(holdKey);
      setIsHoldingValue(false);
      setDisplayValues((old) => ({ [holdKey]: old[holdKey] }));
    }, TRANSITION_LENGTH);

    return () => {
      clearTimeout(timeout);
    };
  }, [holdKey, isHoldingValue]);

  return [displayValues[currentHoldKey], isHoldingValue];
}

export const transitionHoldStyle = css`
  transition: opacity ${TRANSITION_LENGTH - 100}ms ease-in-out;
`;
