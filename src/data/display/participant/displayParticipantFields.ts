import { formatTimer } from "../../../util/formatTimer";
import { Race } from "../../races/types";
import { User } from "../../users/types";
import { ParticipantDisplayFieldGetter } from "../race/displayRaceFields";
import { DisplayParticipant } from "./types";

export type RaceDisplayFieldGetter<TValue> = (
  race: Race,
  userEntities: Record<string, User>
) => TValue;

// A structured builder for the DisplayParticipant object, when given the raw
// "RaceParticipantWithLiveData" and "User" objects retrieved from therun. We could use
// those directly, but having an intermediary type lets us keep our display components
// simple, and means if therun's data structure changes we should only need to make changes
// to this file.
//
// All you should need to do to add a field to this (for example, to expose a runner's splits
// to the stream tool) is add it to the DisplayParticipant interface, and then add a function here
// that pulls it out of either the participant or profile values.
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
};
