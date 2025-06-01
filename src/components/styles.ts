import { css } from "@mui/material";
import { size, SIZES } from "../style/theme";

export const STYLES = {
  spacedFlex: css`
    display: flex;
    gap: ${size(4)};
  `,

  fullWidth: css`
    width: 100%;
  `,

  fullHeight: css`
    height: 100%;
  `,

  fullSize: css`
    width: 100%;
    height: 100%;
  `,

  roundedCorners: css`
    border-radius: ${SIZES.borderRadius};
  `,

  padded: css`
    padding: ${size(4)};
  `,
};
