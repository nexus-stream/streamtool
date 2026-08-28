import { Button } from "@mui/material";
import { ButtonBar, CenteredStack, Page } from "../../components/Layout";
import { StageSelector } from "../docked/components/StageSelector";
import { PreviousStageButton } from "../docked/components/buttons/PreviousStageButton";
import { NextStageButton } from "../docked/components/buttons/NextStageButton";
import { AdvancedSceneSwitcherMessageButton } from "../docked/components/buttons/AdvancedSceneSwitcherMessageButton";
import { ParticipantOrder } from "../docked/components/ParticipantOrder";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";

export function StageManagerPage() {
  return (
    <ObsWebSocketProvider>
      <Page>
        <CenteredStack>
          <StageSelector />
          <ButtonBar>
            <PreviousStageButton />
            <Button
              variant="outlined"
              href="/edit"
              target="_blank"
              size="small"
            >
              Edit
            </Button>
            <NextStageButton />
          </ButtonBar>
          <ButtonBar>
            <AdvancedSceneSwitcherMessageButton name="intermission">
              Intermission
            </AdvancedSceneSwitcherMessageButton>
            <AdvancedSceneSwitcherMessageButton name="live">
              Live
            </AdvancedSceneSwitcherMessageButton>
            <AdvancedSceneSwitcherMessageButton name="results">
              Results
            </AdvancedSceneSwitcherMessageButton>
          </ButtonBar>
          <ParticipantOrder />
        </CenteredStack>
      </Page>
    </ObsWebSocketProvider>
  );
}
