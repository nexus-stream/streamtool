import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { FrameAvatar } from "../components/FrameAvatar";
import { useSelector } from "react-redux";
import { selectCurrentDisplayRace } from "../../../data/display/selectors";

const Params = z.object({
  commentatorPosition: z.coerce.number().default(1),
});

export const commentatorAvatarFrame = buildFrameComponent(
  {
    displayName: "Commentator Avatar",
    width: 240,
    height: 240,
    defaultName: ({ commentatorPosition }) =>
      `Commentator ${commentatorPosition} Avatar`,
  },
  Params,
  ({ commentatorPosition }) => {
    const race = useSelector(selectCurrentDisplayRace);

    const commentator = race?.commentators[commentatorPosition - 1];

    if (!commentator?.avatar) {
      return null;
    }

    return (
      <FrameAvatar
        src={commentator?.avatar ?? undefined}
        transitionHoldKey={`${race?.raceId}:${commentator.user}`}
      />
    );
  }
);
