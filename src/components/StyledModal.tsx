import { Modal, Box, css, styled } from "@mui/material";
import { ReactNode } from "react";
import { COLORS, SIZES, spacing } from "../style/theme";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export function StyledModal({ onClose, children }: Props) {
  return (
    <Modal open onClose={onClose}>
      <Box css={modalContentsStyle}>{children}</Box>
    </Modal>
  );
}

export const ModalButtons = styled("div")`
  display: flex;
  justify-content: end;
  padding-top: ${spacing(4)};
  gap: ${spacing(2)};
`;

const modalContentsStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${SIZES.xl};
  background-color: ${COLORS.bgPop};
  border-width: 2px;
  border-color: ${COLORS.bg};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: ${spacing(4)};
`;
