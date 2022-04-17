import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { CurrentFrame } from "../game/types";
import Rating from "@mui/material/Rating/Rating";
import { Typography } from "@mui/material";

interface ResultsPanelProps {
  nbAvailablePinsToKnock: number;
  currentFrame: CurrentFrame;
  submitNbKnockDownPins: (nbKnockedDownPins: number) => void;
}

const StyledFramePanel = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledLabels = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInputContainer = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FramePanel: FC<ResultsPanelProps> = ({ nbAvailablePinsToKnock, currentFrame, submitNbKnockDownPins }) => {
  const [nbPins, setNbPins] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const isNbKnockedDownPinsValid = (pinsInputValue: number): boolean => {
    if (pinsInputValue >= 0 && pinsInputValue <= nbAvailablePinsToKnock) {
      return true;
    }
    setErrorMessage("Invalid number of knocked down pins");
    return false;
  };

  const handleSubmit = (): void => {
    setErrorMessage("");
    const nbKnockedDownPins = Number(nbPins);
    if (isNbKnockedDownPinsValid(nbKnockedDownPins)) {
      submitNbKnockDownPins(nbKnockedDownPins);
    }
    setNbPins(0);
  };

  return (
    <StyledFramePanel>
      <StyledLabels>
        <div>{`Frame: ${currentFrame.frameNumber}`}</div>
        <div>{`Throw: ${currentFrame.throwNumber}`}</div>
        <div>{errorMessage}</div>
      </StyledLabels>
      <StyledInputContainer>
        <Typography component="legend">Nb of pins knocked down:</Typography>
        <Rating
          name="customized-10"
          value={nbPins}
          defaultValue={0}
          onChange={(event: any, newValue: any) => {
            setNbPins(newValue);
          }}
          max={nbAvailablePinsToKnock}
        />
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </StyledInputContainer>
    </StyledFramePanel>
  );
};

export default FramePanel;
