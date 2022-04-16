import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField/TextField";
import styled from "styled-components";
import { CurrentThrow } from "../game/currentThrow";

interface ResultsPanelProps {
  currentThrow: CurrentThrow;
  submitKnockedPinsCount: any;
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

const FramePanel: FC<ResultsPanelProps> = ({ currentThrow, submitKnockedPinsCount }) => {
  const [pinsInputValue, setPinsInputValue] = useState(0);

  // TODO remove any
  const handleInputChange = (event: any): void => {
    setPinsInputValue(event.target.value);
  };

  const handleSubmit = (): void => {
    submitKnockedPinsCount(Number(pinsInputValue));
    setPinsInputValue(0);
  };

  return (
    <StyledFramePanel>
      <StyledLabels>
        <div>{`Frame: ${currentThrow.frameNumber}`}</div>
        <div>{`Throw: ${currentThrow.throwNumber}`}</div>
        <div>{`Pins available: 10`}</div>
      </StyledLabels>
      <StyledInputContainer>
        <TextField id="outlined-basic" label="Knocked Down Pins" variant="outlined" value={pinsInputValue} onChange={handleInputChange} type="number" />
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </StyledInputContainer>
    </StyledFramePanel>
  );
};

export default FramePanel;
