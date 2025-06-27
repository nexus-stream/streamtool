import { useSelector } from "react-redux";
import { useTwitchApi } from "../../../../hooks/useTwitchApi";
import { selectCurrentStage } from "../../../../data/stages/selectors";
import { useEffect } from "react";
import { selectIsTwitchSyncEnabled } from "../../../../data/config/selectors";

// Whenever our current stage's stream title or game changes, send them to Twitch.
export function TwitchSync() {
  const { updateStreamInfo } = useTwitchApi();
  const isTwitchSyncEnabled = useSelector(selectIsTwitchSyncEnabled);
  const currentStage = useSelector(selectCurrentStage);

  const streamTitle = currentStage?.streamTitle;
  const streamGameName = currentStage?.streamGameName;

  useEffect(() => {
    if (!isTwitchSyncEnabled || !streamTitle || !streamGameName) {
      return;
    }

    void updateStreamInfo(streamTitle, streamGameName);
  }, [isTwitchSyncEnabled, streamGameName, streamTitle, updateStreamInfo]);

  return null;
}
