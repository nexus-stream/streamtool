import { DisplayParticipant } from "../../../data/display/types";

interface Props {
  participant: DisplayParticipant;
}

export function ParticipantStream({ participant }: Props) {
  const embed = buildTwitchEmbedLink(participant.twitchUser);

  return (
    <div className="w-full h-full bg-black">
      <iframe className="w-full h-full" src={embed} />
    </div>
  );
}

function buildTwitchEmbedLink(twitchUser: string) {
  const url = new URL("https://embed.twitch.tv");

  url.searchParams.append("allowfullscreen", "true");
  url.searchParams.append("autoplay", "true");
  url.searchParams.append("controls", "true");
  url.searchParams.append("height", "100%");
  url.searchParams.append("width", "100%");
  url.searchParams.append("layout", "video");
  url.searchParams.append("theme", "dark");

  url.searchParams.append("channel", twitchUser);
  url.searchParams.append("parent", window.location.hostname);

  return url.toString();
}
