import { useEffect, useState } from "react";
import { useAppDispatch } from "../../data/hooks";
import { updateTwitchToken } from "../../data/twitch/twitchSlice";

export function TwitchWebhookPage() {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = getUrlHashParam("access_token");
    if (accessToken) {
      dispatch(updateTwitchToken({ accessToken }));
      window.close();
    } else {
      const errorResponse = getUrlHashParam("error_description");
      setError(errorResponse ?? "unknown error");
    }
  }, [dispatch]);

  return <p>{error}</p>;
}

function getUrlHashParam(param: string) {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return params.get(param);
}
