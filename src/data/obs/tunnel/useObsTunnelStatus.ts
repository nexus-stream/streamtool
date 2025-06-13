import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { obsConnectionStatus, obsPing } from "./actions";
import { addListener } from "@reduxjs/toolkit";
import { OBSWebSocketWithStatus } from "../ObsWebSocketContext";

export function useObsTunnelStatus() {
  const dispatch = useAppDispatch();
  const [status, setStatus] =
    useState<OBSWebSocketWithStatus["status"]>("idle");

  useEffect(() => {
    dispatch(
      addListener({
        actionCreator: obsConnectionStatus,
        effect: (action) => {
          setStatus(action.payload);
        },
      })
    );

    dispatch(obsPing());
  }, [dispatch]);

  return status;
}
