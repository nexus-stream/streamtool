import { useSelector } from "react-redux";
import {
  selectCurrentPatchedDisplayRace,
  selectCurrentStageId,
} from "../../../data/stages/selectors";
import { ButtonBar } from "../../../components/Layout";
import { css, ToggleButton, Tooltip } from "@mui/material";
import { Avatar } from "../../../components/Avatar";
import { useCallback, useState } from "react";
import { size } from "../../../style/theme";
import { useAppDispatch } from "../../../data/hooks";
import { setParticipantOrder } from "../../../data/stages/stageSlice";
import { DisplayParticipant } from "../../../data/display/types";

const EMPTY_PARTICIPANTS: DisplayParticipant[] = [];

export function ParticipantOrder() {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<string | undefined>();
  const stageId = useSelector(selectCurrentStageId);
  const race = useSelector(selectCurrentPatchedDisplayRace);
  const participants = race?.participants ?? EMPTY_PARTICIPANTS;

  const onClick = useCallback(
    (user: string) => {
      if (!selectedUser) {
        setSelectedUser(user);
        return;
      }

      const participantOrder = participants.map(
        (participant) => participant.user
      );

      const selectedUserIndex = participantOrder.indexOf(selectedUser);
      const userIndex = participantOrder.indexOf(user);

      if (!stageId || selectedUserIndex === -1 || userIndex === -1) {
        setSelectedUser(undefined);
        return;
      }

      participantOrder[selectedUserIndex] = user;
      participantOrder[userIndex] = selectedUser;

      dispatch(setParticipantOrder({ id: stageId, participantOrder }));

      setSelectedUser(undefined);
    },
    [dispatch, participants, selectedUser, stageId]
  );

  return (
    <ButtonBar>
      {participants.map((participant) => {
        return (
          <Tooltip title={participant.displayName} key={participant.user}>
            <ToggleButton
              selected={participant.user === selectedUser}
              onClick={() => {
                onClick(participant.user);
              }}
              css={buttonStyle}
              value=""
            >
              <Avatar size="medium" src={participant.avatar} />
            </ToggleButton>
          </Tooltip>
        );
      })}
    </ButtonBar>
  );
}

const buttonStyle = css`
  padding: ${size(1)};
  transition: transform 200ms ease;

  &.Mui-selected {
    transform: translateY(${size(2)});
    img {
      opacity: 0.6;
    }
  }
`;
