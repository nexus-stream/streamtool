import { useCallback, useEffect, useState } from "react";

export function useCrossTabState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const storedItem = getItem<T>(key);

    if (!storedItem) {
      setItem(key, defaultValue);
      return defaultValue;
    }

    return storedItem;
  });

  const setAndPushState = useCallback(
    (newState: T) => {
      setState(newState);
      setItem(key, newState);
    },
    [key]
  );

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key !== buildLocalStorageKey(key)) {
        return;
      }

      const newItem = getItem<T>(key);
      if (!newItem) {
        return;
      }

      setState(newItem);
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  return [state, setAndPushState];
}

function setItem<T>(key: string, item: T) {
  localStorage.setItem(buildLocalStorageKey(key), JSON.stringify(item));
}

function getItem<T>(key: string): T | undefined {
  const item = localStorage.getItem(buildLocalStorageKey(key));
  if (!item) {
    return undefined;
  }

  return JSON.parse(item);
}

function buildLocalStorageKey(key: string) {
  return `cross_tab_state_${key}`;
}
