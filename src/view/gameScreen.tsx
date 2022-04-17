import React, { useState } from "react";
import Button from "@mui/material/Button";
import { NB_PINS_PER_FRAME, computeScore, computeNextStep, verifyResultType } from "../game/gameRules";
import { CurrentFrame } from "../game/currentFrame";
import { FrameResultType } from "../game/frameResultType";
import { FrameResult } from "../game/frameResult";
import { StepType } from "../game/step";
import usePlayerGame from "../game/usePlayerGame";
import ResultsPanel from "./resultsPanel";
import styled from "styled-components";
import FramePanel from "./framePanel";
import EndGameModal from "./endGameModal";

const StyledContainer = styled.div`
  padding: 30px;
  display: flex;
  justify-content: space-between;
`;

const ResultsPanelContainer = styled.div`
  max-width: 400px;
`;

function GameScreen() {
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [nbAvailablePinsToKnock, setNbAvailablePinsToKnock] = useState(NB_PINS_PER_FRAME);
  const { currentFrame, framesResults, framesScores, onUpdateCurrentFrame, onUpdateFramesResults, onUpdateFramesScores } = usePlayerGame();

  const initNextThrow = (resultType: FrameResultType, currentFrame: CurrentFrame, knockedPinsCount: number): void => {
    const updatedCurrentThrowResult = { throwNumber: currentFrame.throwNumber, knockedPinsCount: knockedPinsCount };
    const nextThrowResult = { throwNumber: currentFrame.throwNumber + 1, knockedPinsCount: 0 };
    onUpdateCurrentFrame({
      ...currentFrame,
      throwNumber: currentFrame.throwNumber + 1,
      resultType: resultType,
      throwsResult: [updatedCurrentThrowResult, nextThrowResult],
    });
  };

  const initNextFrame = (currentFrame: CurrentFrame): void => {
    onUpdateCurrentFrame({
      throwNumber: 1,
      frameNumber: currentFrame.frameNumber + 1,
      resultType: FrameResultType.REGULAR,
      throwsResult: [],
    });
    onUpdateFramesResults([
      ...framesResults,
      {
        frameNumber: currentFrame.frameNumber + 1,
        resultType: FrameResultType.REGULAR,
        throwResults: [],
      },
    ]);
  };

  const updateFrameThrowResult = (currentFrame: CurrentFrame, frameResultType: FrameResultType, knockedPinsCount: number): void => {
    const currentFrameIndex = framesResults.findIndex((frameResult: FrameResult) => frameResult.frameNumber === currentFrame.frameNumber);

    const currentFrameResults = framesResults[currentFrameIndex].throwResults;
    const currentThrowResult = {
      throwNumber: currentFrame.throwNumber,
      knockedPinsCount: knockedPinsCount,
    };
    const updatedFrameResult = {
      frameNumber: currentFrame.frameNumber,
      resultType: frameResultType,
      throwResults: [...currentFrameResults, currentThrowResult],
    };
    framesResults[currentFrameIndex] = updatedFrameResult;
    onUpdateFramesResults(framesResults);
  };

  const findNextStep = (frameResultType: FrameResultType, knockedPinsCount: number): void => {
    const nextStep = computeNextStep(currentFrame, frameResultType, knockedPinsCount);
    if (nextStep.type === StepType.NEXT_FRAME) {
      initNextFrame(currentFrame);
    } else if (nextStep.type === StepType.NEXT_THROW) {
      initNextThrow(frameResultType, currentFrame, knockedPinsCount);
    } else {
      endGame();
    }
    setNbAvailablePinsToKnock(nextStep.nbAvailablePinsToKnock);
  };

  const submitKnockedPinsCount = (knockedPinsCount: number): void => {
    const frameResultType = verifyResultType(currentFrame, knockedPinsCount);
    updateFrameThrowResult(currentFrame, frameResultType, knockedPinsCount);
    // TODO attention order is important, if updateFrame is before computeScore, then throwResult passed to computeScore will be already updated, no need to add nb knocked pins
    computeScore(currentFrame, knockedPinsCount, frameResultType, framesResults, framesScores, onUpdateFramesScores);
    findNextStep(frameResultType, knockedPinsCount);
  };

  const resetGame = (): void => {
    onUpdateCurrentFrame({ throwNumber: 1, frameNumber: 1, resultType: FrameResultType.REGULAR, throwsResult: [] });
    onUpdateFramesResults([{ frameNumber: 1, resultType: FrameResultType.REGULAR, throwResults: [] }]);
    onUpdateFramesScores({});
  };

  const handleResetGame = (): void => {
    resetGame();
  };

  const startNewGame = (): void => {
    setIsEndGameModalOpen(false);
    resetGame();
  };

  const endGame = (): void => {
    setIsEndGameModalOpen(true);
  };

  const closeEndGameModal = (): void => {
    setIsEndGameModalOpen(false);
  };

  return (
    <div className="GameScreen">
      <StyledContainer>
        <FramePanel nbAvailablePinsToKnock={nbAvailablePinsToKnock} currentFrame={currentFrame} submitKnockedPinsCount={submitKnockedPinsCount} />
        <ResultsPanelContainer>
          <ResultsPanel framesResults={framesResults} framesScores={framesScores} />
        </ResultsPanelContainer>
      </StyledContainer>
      <Button variant="outlined" color="primary" onClick={handleResetGame}>
        Reset game
      </Button>
      <EndGameModal finalScore={100} startNewGame={startNewGame} open={isEndGameModalOpen} handleClose={closeEndGameModal} />
    </div>
  );
}

export default GameScreen;
