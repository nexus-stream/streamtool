import { useEffect } from "react";
import { addListener } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../data/hooks";
import {
  OBS_TUNNEL_ACTION_PREDICATE,
  obsPing,
} from "../../data/obs/tunnel/actions";
import {
  ObsTunnelMessage,
  unwrapObsTunnelMessage,
  wrapObsTunnelMessage,
} from "../../data/obs/tunnel/messages";

export function useObsTunnelClient() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(
      addListener({
        predicate: (action) => {
          return action.type.indexOf(`${OBS_TUNNEL_ACTION_PREDICATE}/`) === 0;
        },
        effect: (action) => {
          sendToParent(wrapObsTunnelMessage(action));
        },
      })
    );
    dispatch(obsPing());
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const action = unwrapObsTunnelMessage(event.data);
      if (!action) {
        return;
      }

      dispatch(action);
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [dispatch]);
}

function sendToParent(message: ObsTunnelMessage) {
  const parent = import.meta.env.VITE_HTTP_ORIGIN ?? "/";
  window.parent?.postMessage(message, parent);
}
