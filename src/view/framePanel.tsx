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
`;

const StyledLabel = styled.div`
  display: flex;
  flex-direction: column;
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
      <StyledLabel>
        <div>{`Frame: ${currentThrow.frameNumber}`}</div>
        <div>{`Throw: ${currentThrow.throwNumber}`}</div>
        <div>{`Pins available: 10`}</div>
      </StyledLabel>
      <TextField id="outlined-basic" label="Knocked Down Pins" variant="outlined" value={pinsInputValue} onChange={handleInputChange} type="number" />
      <Button variant="outlined" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </StyledFramePanel>
  );
};

export default FramePanel;
