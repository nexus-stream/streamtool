import { useSelector } from "react-redux";
import { stageSelectors } from "../stages/selectors";
import { DisplayParticipant } from "./types";
import { useAppSelector } from "../hooks";
import { raceSelectors } from "../races/selectors";
import { userSelectors } from "../users/selectors";
import { DISPLAY_PARTICIPANT_FIELDS } from "./displayParticipantFields";
import { RaceStage } from "../stages/types";

export function useDisplayParticipantValue<
  TParam extends keyof DisplayParticipant
>(param: TParam, stageId: string, user: string): DisplayParticipant[TParam] {
  const stage = useSelector(stageSelectors.selectEntities)[stageId];
  const race = useAppSelector(raceSelectors.selectEntities)[
    (stage as RaceStage).raceId
  ];
  const users = useAppSelector(userSelectors.selectEntities);

  const participant = race.participants?.find(
    (participant) => participant.user === user
  );

  if (!participant) {
    throw new Error(`Tried displaying invalid participant ${user}`);
  }

  return DISPLAY_PARTICIPANT_FIELDS[param](participant, users[user] ?? {});
}
