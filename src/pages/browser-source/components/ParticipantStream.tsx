import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";

interface Props {
  twitchUser: string;
}

export function ParticipantStream({ twitchUser }: Props) {
  const embed = buildProxiedTwitchEmbedLink(twitchUser);

  return (
    <div css={STYLES.fullSize}>
      <iframe css={iframeStyle} src={embed} />
    </div>
  );
}

function buildProxiedTwitchEmbedLink(twitchUser: string) {
  const origin = import.meta.env.VITE_HTTPS_ORIGIN ?? window.location.origin;
  const parent = new URL(origin).hostname;
  const url = new URL("/proxy", origin);
  url.searchParams.append("src", buildTwitchEmbedLink(twitchUser, parent));
  return url.toString();
}

function buildTwitchEmbedLink(twitchUser: string, parent: string) {
  const url = new URL("https://embed.twitch.tv");

  url.searchParams.append("allowfullscreen", "true");
  url.searchParams.append("autoplay", "true");
  url.searchParams.append("controls", "true");
  url.searchParams.append("height", "100%");
  url.searchParams.append("width", "100%");
  url.searchParams.append("layout", "video");
  url.searchParams.append("theme", "dark");

  url.searchParams.append("channel", twitchUser);
  url.searchParams.append("parent", parent);

  return url.toString();
}

const iframeStyle = css`
  ${STYLES.fullSize};
  display: block;
  border: none;
`;
