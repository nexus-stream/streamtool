import { useMemo } from "react";

export function useQueryParam(name: string): string {
  const param = useMemo(
    () =>
      window.location.search
        .slice(1)
        .split("&")
        .find((token) => {
          const [key, val] = token.split("=");
          if (key === name) {
            return val;
          }
        }),
    [name]
  );

  return param ?? "";
}
