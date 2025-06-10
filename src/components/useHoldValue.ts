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
  transitionLength: number
): [TValue, boolean] {
  const [displayValue, setDisplayValue] = useState(value);
  const [isHoldingValue, setIsHoldingValue] = useState(false);

  useEffect(() => {
    if (isHoldingValue) {
      return;
    }

    if (value !== displayValue) {
      setIsHoldingValue(true);
    }
  }, [displayValue, isHoldingValue, value]);

  useEffect(() => {
    if (!isHoldingValue) {
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayValue(value);
      setIsHoldingValue(false);
    }, transitionLength);

    return () => {
      clearTimeout(timeout);
    };
  }, [isHoldingValue, transitionLength, value]);

  return [displayValue, isHoldingValue];
}
