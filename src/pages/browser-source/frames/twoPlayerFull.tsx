import { buildFrameComponent } from "../frame";
import { css } from "@emotion/react";
import { STYLES } from "../../../components/styles";
import { size } from "../../../style/theme";
import { FRAME_STYLES } from "../components/styles";
import { DisplayPlaceholder } from "../components/DisplayPlaceholder";
import { PersonalBest } from "../components/two-player/PersonalBest";
import { Triangle } from "../components/two-player/Triangle";
import { Nameplate } from "../components/two-player/Nameplate";
import { ParticipantAvatar } from "../components/two-player/ParticipantAvatar";
import { TwoPlayerTimer } from "../components/two-player/Timer";

export const twoPlayerSquareFrame = buildFrameComponent(
  {
    displayName: "Two Player 4:3",
    width: 1920,
    height: 1080,
  },
  ({ race }) => {
    return (
      <div css={containerStyle}>
        <div css={displayRowStyle}>
          <DisplayPlaceholder aspectRatio="full" />
          <DisplayPlaceholder aspectRatio="full" />
        </div>
        <div css={nameAndTimerRowStyle}>
          <ParticipantAvatar participant={race.participants[0]} />
          <PersonalBest pb={race.participants[0].pb} />
          <Triangle kind="ulbr" />
          <Nameplate participant={race.participants[0]} side="left" />

          <TwoPlayerTimer race={race} />

          <Nameplate participant={race.participants[1]} side="right" />
          <Triangle kind="urbl" />
          <PersonalBest pb={race.participants[1].pb} />
          <ParticipantAvatar participant={race.participants[1]} />
        </div>
      </div>
    );
  }
);

const containerStyle = css`
  /* ${STYLES.fullSize}; */
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;

  p {
    font-size: ${size(6)};
    margin: 0;
  }
`;

const displayRowStyle = css`
  display: flex;
  gap: ${size(2)};
  ${FRAME_STYLES.gradientBkg.twoPlayer.blue};
  padding-top: ${size(2)};
`;

const nameAndTimerRowStyle = css`
  display: flex;
  height: 84px;
`;
