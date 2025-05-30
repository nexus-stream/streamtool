import { css } from "@mui/material";
import { spacing } from "../style/theme";

export const spacedFlex = css`
  display: flex;
  gap: ${spacing(4)};
`;

export const fullWidth = css`
  width: 100%;
`;

export const fullHeight = css`
  height: 100%;
`;

export const fullSize = css`
  ${fullWidth};
  ${fullHeight};
`;

export const roundedCorners = css`
  border-radius: ${spacing(1.5)};
`;

export const padded = css`
  padding: ${spacing(4)};
`;
