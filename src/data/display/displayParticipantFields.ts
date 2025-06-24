import { formatTimer } from "./displayTimerHooks";
import { DisplayParticipant, ParticipantDisplayFieldGetter } from "./types";

export const DISPLAY_PARTICIPANT_FIELDS: {
  [K in keyof DisplayParticipant]: ParticipantDisplayFieldGetter<
    DisplayParticipant[K]
  >;
} = {
  user: (participant) => participant.user,
  twitchUser: (participant) => participant.user,
  displayName: (participant) => participant.user,
  pronouns: (_, profile) => profile.pronouns ?? null,
  avatar: (_, profile) => profile.picture ?? null,
  status: (participant) => participant.status,
  finalTime: (participant) => participant.finalTime,
  startTime: (participant) => {
    if (!participant.liveData) {
      return null;
    }

    return (
      participant.liveData.splitStartedAt - participant.liveData.currentTime
    );
  },
  pb: (participant) => {
    if (!participant.pb) {
      return null;
    }

    const time = parseFloat(participant.pb);
    if (isNaN(time)) {
      return null;
    }

    return formatTimer(time);
  },
  // Handled entirely in overrides since therun doesn't have a concept of
  // a "score" between multiple races.
  score: () => null,
};
