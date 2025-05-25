import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { StyledModal } from "../../../components/StyledModal";
import { useAppDispatch } from "../../../data/hooks";
import { useCallback, useState } from "react";
import { createStageForRace } from "../../../data/stages/thunks";

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

    try {
      setStatus("loading");
      await dispatch(createStageForRace({ raceId, name }));
      setStatus("finished");
      onClose();
    } catch {
      setStatus("error");
    }
  }, [dispatch, name, onClose, theRunURL]);

  return (
    <StyledModal onClose={onClose}>
      <FormControl fullWidth className="flex flex-col gap-8">
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
          label="therun.gg URL"
          value={theRunURL}
          disabled={status === "loading"}
          onChange={(event) => setTheRunURL(event.target.value)}
        />

        {status === "error" && (
          <FormHelperText>
            Fetching from therun.gg failed, try again.
          </FormHelperText>
        )}

        <div className="flex justify-end pt-4 gap-2">
          <Button disabled={status === "loading"} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={status === "loading"} onClick={onConfirm}>
            {status === "loading" ? "Loading..." : "Confirm"}
          </Button>
        </div>
      </FormControl>
    </StyledModal>
  );
}

function extractTheRunId(url: string): string {
  const regex = /therun\.gg\/races\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match?.[1] ?? url;
}
