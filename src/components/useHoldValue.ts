import { useState, useEffect } from "react";

// This needs to stay consistent across the UI or it's gonna look ugly.
const TRANSITION_LENGTH = 500;

// Need a signal variable (key or id) to determine whether the value is held
// rather than using the change of value itself.

// Want to support timers moving smoothly as they change, while also fading
// when we switch between timers.

// Also still fading even if text (like pronouns) are unchanged between transitions

export function useHoldValue<TValue>(
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
