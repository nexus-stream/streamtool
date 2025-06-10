import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import { Avatar } from "../../../components/Avatar";

const Params = z.object({
  participantPosition: z.coerce.number().default(1),
});

export const avatarFrame = buildFrameComponent(
  {
    displayName: "Avatar",
    width: 240,
    height: 240,
  },
  Params,
  ({ race, participantPosition }) => {
    const participant = race.participants[participantPosition - 1];

    if (!participant) {
      return null;
    }

    return <Avatar src={participant.avatar} size="overlay" />;
  }
);
