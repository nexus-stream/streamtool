import { Avatar } from "../../../components/Avatar";
import {
  transitionHoldStyle,
  useTransitionHoldValue,
} from "../../../util/useTransitionHoldValue";
import { css } from "@emotion/react";
import classNames from "classnames";

interface Props {
  src?: string;
  transitionHoldKey: string;
}

export function FrameAvatar({ src, transitionHoldKey }: Props) {
  const [avatarSrc, isTransition] = useTransitionHoldValue(
    src,
    transitionHoldKey
  );

  return (
    <div className={classNames({ fading: isTransition })} css={containerStyle}>
      <Avatar src={avatarSrc} size="overlay" />
    </div>
  );
}

const containerStyle = css`
  ${transitionHoldStyle};
  opacity: 1;

  &.fading {
    opacity: 0;
    transition-delay: unset;
  }
`;
