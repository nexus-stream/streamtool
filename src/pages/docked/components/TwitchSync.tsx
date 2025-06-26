import { useSelector } from "react-redux";
import { useTwitchApi } from "../../../hooks/useTwitchApi";
import { selectCurrentStage } from "../../../data/stages/selectors";
import { useEffect } from "react";

export function TwitchSync() {
  const { updateStreamInfo } = useTwitchApi();
  const currentStage = useSelector(selectCurrentStage);

  const streamTitle = currentStage?.streamTitle;
  const streamGameName = currentStage?.streamGameName;

  useEffect(() => {
    if (!streamTitle || !streamGameName) {
      return;
    }

    void updateStreamInfo(streamTitle, streamGameName);
  }, [streamGameName, streamTitle, updateStreamInfo]);

  return null;
}
