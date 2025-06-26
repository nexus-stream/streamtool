import { css } from "@emotion/react";
import { STYLES } from "../../../style/styles";

interface Props {
  twitchUser?: string;
  twitchVideo?: string;
}

export function TwitchEmbed({ twitchUser, twitchVideo }: Props) {
  if (!twitchUser && !twitchVideo) {
    return <div>Embed requires a user or a video</div>;
  }

  if (twitchUser && twitchVideo) {
    return <div>Embed cannot have both a user and a video</div>;
  }

  const embed = buildTwitchEmbedLink({ twitchUser, twitchVideo });

  return (
    <div css={STYLES.fullSize}>
      <iframe css={iframeStyle} src={embed} />
    </div>
  );
}

function buildTwitchEmbedLink({ twitchUser, twitchVideo }: Props) {
  const url = new URL("https://embed.twitch.tv");

  url.searchParams.append("allowfullscreen", "true");
  url.searchParams.append("autoplay", "true");
  url.searchParams.append("controls", "true");
  url.searchParams.append("height", "100%");
  url.searchParams.append("width", "100%");
  url.searchParams.append("layout", "video");
  url.searchParams.append("theme", "dark");

  if (twitchUser) {
    url.searchParams.append("channel", twitchUser);
  }

  if (twitchVideo) {
    url.searchParams.append("video", twitchVideo);
  }

  url.searchParams.append("parent", window.location.hostname);

  return url.toString();
}

const iframeStyle = css`
  ${STYLES.fullSize};
  display: block;
  border: none;
`;
