import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { ModalButtons, StyledModal } from "../../../components/StyledModal";
import { useAppDispatch } from "../../../data/hooks";
import { useCallback, useState } from "react";
import {
  createStageForRace,
  createStageForTagOnly,
  createStageForVod,
} from "../../../data/stages/thunks";
import { VerticalContent } from "../../../components/Layout";

interface Props {
  onClose: () => void;
}

type CreationStatus = "idle" | "loading" | "error" | "finished";

export function StageCreateModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [theRunURL, setTheRunURL] = useState("");
  const [status, setStatus] = useState<CreationStatus>("idle");

  const dispatch = useAppDispatch();

  const onConfirm = useCallback(async () => {
    const raceId = extractTheRunId(theRunURL);
    if (raceId) {
      try {
        setStatus("loading");
        await dispatch(createStageForRace({ raceId, name }));
        setStatus("finished");
        onClose();
      } catch {
        setStatus("error");
      }
      return;
    }

    const twitchVodId = extractTwitchVodID(theRunURL);
    if (twitchVodId) {
      dispatch(createStageForVod({ vodId: twitchVodId, name }));
      setStatus("finished");
      onClose();
      return;
    }

    if (!theRunURL.trim()) {
      dispatch(createStageForTagOnly({ name }));
      setStatus("finished");
      onClose();
      return;
    }

    setStatus("error");
  }, [dispatch, name, onClose, theRunURL]);

  return (
    <StyledModal onClose={onClose}>
      <FormControl fullWidth>
        <VerticalContent>
          <h2>Create new stage</h2>

          <TextField
            type="string"
            label="Name"
            value={name}
            disabled={status === "loading"}
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            type="string"
            label="therun.gg URL or Twitch VOD URL (optional)"
            value={theRunURL}
            disabled={status === "loading"}
            onChange={(event) => setTheRunURL(event.target.value)}
          />

          {status === "error" && (
            <FormHelperText>
              Fetching from therun.gg failed, try again.
            </FormHelperText>
          )}

          <ModalButtons>
            <Button disabled={status === "loading"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={status === "loading" || !name.trim()}
              onClick={onConfirm}
            >
              {status === "loading" ? "Loading..." : "Confirm"}
            </Button>
          </ModalButtons>
        </VerticalContent>
      </FormControl>
    </StyledModal>
  );
}

function extractTheRunId(url: string): string | undefined {
  const regex = /therun\.gg\/races\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match?.[1];
}

function extractTwitchVodID(url: string): string | undefined {
  const regex = /twitch\.tv\/videos\/([0-9]+)/;
  const match = url.match(regex);
  return match?.[1];
}
