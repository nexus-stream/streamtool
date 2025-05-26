import { useState, useCallback } from "react";

// We have inputs that we want to be able to conditionally hook up to Redux state
// and be able to edit while it's connected and disconnected. This gives us a piece
// of state that'll either be managed locally or by a passed in backing value / setter
// depending on whether the backing value is defined.
export function useSyncableLocalState<TValue>(
  backingValue: TValue | undefined,
  setBackingValue: (value: TValue | undefined) => void
): [
  TValue | undefined,
  (newValue: TValue | undefined) => void,
  boolean,
  (newIsSynced: boolean) => void
] {
  const isSynced = backingValue !== undefined;
  const [localValue, setLocalValue] = useState<TValue | undefined>(
    backingValue
  );

  const setValue = useCallback(
    (newValue: TValue | undefined) => {
      setLocalValue(newValue);
      if (isSynced) {
        setBackingValue(newValue);
      }
    },
    [setBackingValue, isSynced]
  );

  const setIsSynced = useCallback(
    (newIsSynced: boolean) => {
      console.log(newIsSynced, backingValue, localValue);
      if (newIsSynced) {
        setLocalValue(backingValue ?? localValue);
        setBackingValue(backingValue ?? localValue);
      } else {
        setLocalValue(undefined);
        setBackingValue(undefined);
      }
    },
    [backingValue, localValue, setBackingValue]
  );

  return [backingValue ?? localValue, setValue, isSynced, setIsSynced];
}
