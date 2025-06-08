import { css } from "@emotion/react";
import { DisplayRace } from "../../../../data/display/types";
import { useDisplayRaceTimer } from "../../../../data/display/displayTimerHooks";

interface Props {
  race: DisplayRace;
}

export function TwoPlayerTimer({ race }: Props) {
  const time = useDisplayRaceTimer(race);

  return (
    <div css={containerStyle}>
      <p>{time}</p>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;
