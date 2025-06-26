import { RaceParticipantWithLiveData } from "../../races/types";
import { User } from "../../users/types";
import { DisplayParticipant } from "../race/types";
import { DISPLAY_PARTICIPANT_FIELDS } from "./displayParticipantFields";

export function buildDisplayParticipant(
  participant: RaceParticipantWithLiveData,
  profile: Partial<User>
): DisplayParticipant {
  const builtValue: { [key: string]: unknown } = {};
  for (const key in DISPLAY_PARTICIPANT_FIELDS) {
    const typedKey = key as keyof DisplayParticipant;
    builtValue[typedKey] = DISPLAY_PARTICIPANT_FIELDS[typedKey](
      participant,
      profile
    );
  }

  // We do some hardcore Typescript lying here. This relies on
  // DISPLAY_PARTICIPANT_FIELDS's typing forcing it to have
  // entries for every key in DisplayParticipant.
  return builtValue as unknown as DisplayParticipant;
}
