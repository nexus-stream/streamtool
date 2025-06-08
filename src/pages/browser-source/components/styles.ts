import { css } from "@mui/material";
import { COLORS } from "../../../style/theme";

export const FRAME_STYLES = {
  gradientBkg: {
    twoPlayer: {
      blue: css`
        background-image: linear-gradient(
          90deg,
          ${COLORS.frameBlueLight} 10%,
          transparent 50%,
          ${COLORS.frameBlueLight} 90%
        );
        background-color: ${COLORS.frameBlueDark};
        background-attachment: fixed;
      `,
      gray: css`
        background-image: linear-gradient(
          90deg,
          ${COLORS.frameGrayLight} 0%,
          ${COLORS.frameGrayDark} 20%,
          ${COLORS.frameGrayDark} 80%,
          ${COLORS.frameGrayLight} 100%
        );
        background-attachment: fixed;
      `,
    },

    sevenPlayer: {
      blue: css`
        background-image: linear-gradient(
          90deg,
          ${COLORS.frameBlueLight} 0%,
          ${COLORS.frameBlueDark} 100%
        );
        background-attachment: fixed;
      `,

      gray: css`
        background-image: linear-gradient(
          90deg,
          ${COLORS.frameGrayLight} 0%,
          ${COLORS.frameGrayDark} 100%
        );
        background-attachment: fixed;
      `,
    },
  },
};
