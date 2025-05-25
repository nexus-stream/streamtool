import { Modal, Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export function StyledModal({ onClose, children }: Props) {
  return (
    <Modal open onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-700 border-2 border-black shadow-lg p-4">
        {children}
      </Box>
    </Modal>
  );
}
