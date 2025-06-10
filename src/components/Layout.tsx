import { styled } from "@mui/material";
import { STYLES } from "./styles";

export const Page = styled("div")`
  ${STYLES.fullSize};
  ${STYLES.spacedFlex};
  ${STYLES.padded};
`;

export const HorizontalContent = styled("div")`
  ${STYLES.fullSize};
  ${STYLES.spacedFlex};
`;

export const VerticalContent = styled("div")`
  ${STYLES.fullSize};
  ${STYLES.spacedFlex};
  flex-direction: column;
`;

export const TitleBar = styled("div")`
  ${STYLES.spacedFlex};
  align-items: center;
`;

export const CenteredStack = styled("div")`
  ${STYLES.fullSize};
  ${STYLES.spacedFlex};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ButtonBar = styled("div")`
  ${STYLES.fullWidth};
  ${STYLES.spacedFlex};
  justify-content: center;
  flex-wrap: wrap;
`;
