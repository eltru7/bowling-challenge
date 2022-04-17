import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField/TextField";
import styled from "styled-components";
import { CurrentFrame } from "../game/currentFrame";

interface ResultsPanelProps {
  nbAvailablePinsToKnock: number;
  currentFrame: CurrentFrame;
  submitKnockedPinsCount: (nbKnockedDownPins: number) => void;
}

const StyledFramePanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabels = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInputContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const FramePanel: FC<ResultsPanelProps> = ({ nbAvailablePinsToKnock, currentFrame, submitKnockedPinsCount }) => {
  const [pinsInputValue, setPinsInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isNbKnockedDownPinsValid = (pinsInputValue: number): boolean => {
    if (pinsInputValue >= 0 && pinsInputValue <= nbAvailablePinsToKnock) {
      return true;
    }
    setErrorMessage("Invalid number of knocked down pins");
    return false;
  };

  // TODO remove any
  const handleInputChange = (event: any): void => {
    setPinsInputValue(event.target.value);
  };

  const handleSubmit = (): void => {
    setErrorMessage("");
    const nbKnockedDownPins = Number(pinsInputValue);
    if (isNbKnockedDownPinsValid(nbKnockedDownPins)) {
      submitKnockedPinsCount(nbKnockedDownPins);
    }
    setPinsInputValue("");
  };

  return (
    <StyledFramePanel>
      <StyledLabels>
        <div>{`Frame: ${currentFrame.frameNumber}`}</div>
        <div>{`Throw: ${currentFrame.throwNumber}`}</div>
        <div>{`Nb of pins available to hit: ${nbAvailablePinsToKnock}`}</div>
        <div>{errorMessage}</div>
      </StyledLabels>
      <StyledInputContainer>
        <TextField id="outlined-basic" label="Nb of pins knocked down" variant="outlined" value={pinsInputValue} onChange={handleInputChange} type="number" />
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </StyledInputContainer>
    </StyledFramePanel>
  );
};

export default FramePanel;
