import { useSelector } from "react-redux";
import { selectCurrentStageId } from "../../../data/stages/selectors";
import { css, ToggleButton } from "@mui/material";
import { Avatar } from "../../../components/Avatar";
import { useCallback, useState } from "react";
import { size } from "../../../style/theme";
import { useAppDispatch } from "../../../data/hooks";
import { setParticipantOrder } from "../../../data/stages/stageSlice";
import { selectCurrentDisplayRace } from "../../../data/display/selectors";
import { DisplayParticipant } from "../../../data/display/participant/types";

const EMPTY_PARTICIPANTS: DisplayParticipant[] = [];

// Displays all participants for the current stage's race and allows them to be
// manually reordered.
export function ParticipantOrder() {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<string | undefined>();
  const stageId = useSelector(selectCurrentStageId);
  const race = useSelector(selectCurrentDisplayRace);
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
    <div css={containerStyle}>
      {participants.map((participant) => {
        return (
          <ToggleButton
            key={participant.user}
            selected={participant.user === selectedUser}
            onClick={() => {
              onClick(participant.user);
            }}
            css={buttonStyle}
            value=""
          >
            <Avatar size="medium" src={participant.avatar} />
            <p>{participant.displayName}</p>
          </ToggleButton>
        );
      })}
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: ${size(2)};
  min-width: ${size(64)};
`;

const buttonStyle = css`
  display: flex;
  justify-content: left;
  gap: ${size(4)};
  padding: ${size(0.5)};
  transition: transform 200ms ease;
  text-transform: unset;
  /* background-color: rgba(255, 255, 255, 0.1); */

  &.Mui-selected {
    transform: translateX(${size(4)});
    img {
      opacity: 0.6;
    }
  }
`;
