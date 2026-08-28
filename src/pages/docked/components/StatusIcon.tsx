import { css, SerializedStyles } from "@emotion/react";
import { FC, ReactNode } from "react";

export type StatusTone = "connected" | "connecting" | "disconnected" | "idle" | "inactive";

interface Props {
  src: string;
  alt: string;
  status: StatusTone;
  children?: ReactNode;
}

export const StatusIcon: FC<Props> = ({ src, alt, status }) => {
  return (
    <div css={[containerStyle, statusStyles[status]]}>
      <img src={src} alt={alt} css={imageStyle} />
    </div>
  );
};

const containerStyle = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-sizing: border-box;
  transition: all 150ms ease;
`;

const imageStyle = css`
  width: 14px;
  height: 14px;
  object-fit: contain;
  display: block;
`;

const statusStyles: Record<StatusTone, SerializedStyles> = {
  connected: css`
    border: 2px solid #2e7d32;
    background: rgba(46, 125, 50, 0.25);
    box-shadow: 0 0 4px rgba(46, 125, 50, 0.5);
  `,
  connecting: css`
    border: 2px solid #ed6c02;
    background: rgba(237, 108, 2, 0.25);
    animation: statusPulse 1.2s infinite ease-in-out;
    @keyframes statusPulse {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 2px rgba(237, 108, 2, 0.4);
      }
      50% {
        opacity: 0.6;
        box-shadow: 0 0 6px rgba(237, 108, 2, 0.8);
      }
    }
  `,
  disconnected: css`
    border: 2px solid #d32f2f;
    background: rgba(211, 47, 47, 0.2);
    box-shadow: 0 0 3px rgba(211, 47, 47, 0.4);
  `,
  inactive: css`
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.06);
    opacity: 0.85;
  `,
  idle: css`
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.04);
    opacity: 0.65;
  `,
};
