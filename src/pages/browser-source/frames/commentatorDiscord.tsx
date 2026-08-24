import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { useSelector } from "react-redux";
import { selectCurrentDisplayRace } from "../../../data/display/selectors";
import { CommentatorDiscord } from "../../../components/CommentatorDiscord";

const Params = z.object({
  commentatorPosition: z.coerce.number().default(1),
});

export const commentatorDiscordFrame = buildFrameComponent(
  {
    displayName: "Commentator Discord",
    width: 240,
    height: 240,
    defaultName: ({ commentatorPosition }) =>
      `Commentator ${commentatorPosition} Discord`,
  },
  Params,
  ({ commentatorPosition }) => {
    const race = useSelector(selectCurrentDisplayRace);

    const commentator = race?.commentators[commentatorPosition - 1];

    if (!commentator?.discordId) {
      return null;
    }

    return (
      <CommentatorDiscord
        discordId={commentator.discordId}
        size="overlay"
      />
    );
  }
);
