import React, { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

interface EndGameModalProps {
  finalScore: number;
  startNewGame: () => void;
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "20px",
  flexDirection: "column",
};

const EndGameModal: FC<EndGameModalProps> = ({ finalScore, startNewGame, open, handleClose }) => {
  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div>{`Final score: ${finalScore}`}</div>
          <Button variant="outlined" color="primary" onClick={startNewGame}>
            Start a new game
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EndGameModal;
