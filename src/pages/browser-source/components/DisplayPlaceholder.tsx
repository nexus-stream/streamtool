import { styled } from "@mui/material";
import { COLORS, size } from "../../../style/theme";

type AspectRatio = "full" | "wide" | "square";

export const DisplayPlaceholder = styled("div")<{
  aspectRatio: AspectRatio;
}>`
  aspect-ratio: ${(props) => {
    switch (props.aspectRatio) {
      case "full":
        return "4 / 3";
      case "wide":
        return "16 / 9";
      case "square":
        return "1 / 1";
    }
  }};
  background-color: ${COLORS.placeholder};
  box-shadow: inset 0 0 ${size(16)} ${COLORS.placeholderBorder};
  box-sizing: border-box;
  flex-grow: 1;
`;
