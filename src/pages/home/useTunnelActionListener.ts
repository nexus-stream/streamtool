import {
  Action,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useEffect } from "react";
import { unwrapObsTunnelMessage } from "../../data/obs/tunnel/messages";

export function useTunnelActionListener<Type extends string>(
  actionCreator: ActionCreatorWithoutPayload<Type>,
  callback: (action: Action<Type>) => void
): void;
export function useTunnelActionListener<Type extends string, Payload>(
  actionCreator: ActionCreatorWithPayload<Payload, Type>,
  callback: (action: PayloadAction<Payload, Type>) => void
): void;
export function useTunnelActionListener(
  actionCreator: { type: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (action: any) => void
): void {
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const action = unwrapObsTunnelMessage(event.data);
      if (!action || action.type !== actionCreator.type) {
        return;
      }

      callback(action);
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [actionCreator.type, callback]);
}
