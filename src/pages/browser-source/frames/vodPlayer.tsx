import { buildFrameComponent } from "../frame";
import { TwitchEmbed } from "../components/TwitchEmbed";
import { useTransitionHoldValue } from "../../../util/useTransitionHoldValue";
import { css } from "@emotion/react";
import { STYLES } from "../../../style/styles";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { stageSelectors } from "../../../data/stages/selectors";

export const vodPlayerFrame = buildFrameComponent(
  {
    displayName: "Vod Player",
    width: 1920,
    height: 1080,
    defaultName: () => "Vod Player",
    skipRequireRace: true,
  },
  ({ stageId }) => {
    const stage = useSelector(stageSelectors.selectEntities)[stageId];
    const currentVodId = stage.kind === "vod" ? stage.vodId : "";

    const [vodId, isTransition] = useTransitionHoldValue(
      currentVodId,
      `${stageId}:${currentVodId}`
    );

    if (stage.kind !== "vod") {
      return null;
    }

    return (
      <div
        className={classNames({ fading: isTransition })}
        css={containerStyle}
      >
        <TwitchEmbed twitchVideo={vodId} />
      </div>
    );
  }
);

const containerStyle = css`
  ${STYLES.fullSize};
  transition: opacity 400ms ease-in-out;
  transition-delay: 100ms;
  opacity: 1;

  &.fading {
    transition-delay: unset;
    opacity: 0;
  }
`;
