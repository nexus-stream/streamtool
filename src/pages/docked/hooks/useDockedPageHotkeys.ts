import { useHotkeys } from "react-hotkeys-hook";
import { toggleIsAdmin } from "../../../data/config/configSlice";
import { useAppDispatch } from "../../../data/hooks";

// This could be useful to add hotkeys for hosts to use during an event, but
// right now it's mostly used to hide layout buildling functionality so hosts
// don't stumble on it by accident.
export function useDockedPageHotkeys() {
  const dispatch = useAppDispatch();

  useHotkeys(
    "ctrl+f",
    () => {
      window.open(`/frame`);
    },
    []
  );

  useHotkeys(
    "ctrl+d",
    () => {
      window.open(`/debug`);
    },
    []
  );

  useHotkeys(
    "ctrl+a",
    () => {
      dispatch(toggleIsAdmin());
    },
    [dispatch]
  );
}
