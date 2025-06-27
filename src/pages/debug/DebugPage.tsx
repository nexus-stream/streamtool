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
import { useSelector } from "react-redux";
import { selectCurrentStageId } from "../../data/stages/selectors";

// Page that renders debug data that's useful for people building layouts.
export function DebugPage() {
  const currentStageId = useSelector(selectCurrentStageId);

  if (!currentStageId) {
    return (
      <div css={containerStyle}>
        Select a stage in the dock to view debug data
      </div>
    );
  }

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
