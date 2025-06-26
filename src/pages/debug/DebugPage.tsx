import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FlattenedDisplayDataViewer } from "./components/FlattenedDisplayDataViewer";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  css,
} from "@mui/material";
import { TitleBar } from "../../components/Layout";
import { size } from "../../style/theme";
import { AllData } from "./components/AllData";

export function DebugPage() {
  return (
    <div css={containerStyle}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TitleBar>Advanced Scene Switcher Data</TitleBar>
        </AccordionSummary>
        <AccordionDetails>
          <FlattenedDisplayDataViewer />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TitleBar>All Available therun.gg Data</TitleBar>
        </AccordionSummary>
        <AccordionDetails>
          <AllData />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const containerStyle = css`
  margin: ${size(4)};
`;
