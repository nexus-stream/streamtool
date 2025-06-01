import { styled } from "@mui/material";
import { COLORS } from "../../../style/theme";

type AspectRatio = "full" | "wide";

export const DisplayPlaceholder = styled("div")<{
  aspectRatio: AspectRatio;
}>`
  aspect-ratio: ${(props) => {
    switch (props.aspectRatio) {
      case "full":
        return "4 / 3";
      case "wide":
        return "16 / 9";
    }
  }};
  background-color: ${COLORS.placeholder};
  flex-grow: 1;
`;
