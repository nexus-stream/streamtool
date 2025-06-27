import { useEffect, useState } from "react";
import { useAppDispatch } from "../../data/hooks";
import { updateTwitchToken } from "../../data/twitch/twitchSlice";
import { useTwitchApi } from "../../hooks/useTwitchApi";

// This is the page we give to Twitch's oauth flow for it to redirect to
// with our access token. All it does is validate the token, then stuff
// it into Redux and close the window.
export function TwitchWebhookPage() {
  const accessToken = getUrlHashParam("access_token");
  const [error, setError] = useState("");
  const { validate } = useTwitchApi(accessToken ?? undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isCurrentRun = true;

    const toRun = async () => {
      const result = await validate();

      if (!isCurrentRun) {
        return;
      }

      if (!result) {
        const errorResponse = getUrlHashParam("error_description");
        setError(errorResponse ?? "unknown error");
        return;
      }

      dispatch(updateTwitchToken({ accessToken: accessToken! }));
      window.close();
    };
    void toRun();

    return () => {
      isCurrentRun = false;
    };
  }, [accessToken, dispatch, validate]);

  return <p>{error}</p>;
}

function getUrlHashParam(param: string) {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return params.get(param);
}
