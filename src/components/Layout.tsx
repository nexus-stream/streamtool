import { styled } from "@mui/material";
import { fullSize, padded, spacedFlex } from "./primitives";

export const Page = styled("div")`
  ${fullSize};
  ${spacedFlex};
  ${padded};
`;

export const HorizontalContent = styled("div")`
  ${fullSize};
  ${spacedFlex};
`;

export const VerticalContent = styled("div")`
  ${fullSize};
  ${spacedFlex};
  flex-direction: column;
`;

export const TitleBar = styled("div")`
  ${spacedFlex};
  align-items: center;
`;

export const CenteredStack = styled("div")`
  ${fullSize};
  ${spacedFlex};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ButtonBar = styled("div")`
  ${spacedFlex};
  justify-content: center;
  flex-wrap: wrap;
`;
