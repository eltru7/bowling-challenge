import React, { useState } from "react";
import { NB_PINS_PER_FRAME, computeScore, computeNextStep, verifyResultType } from "../game/gameRules";
import ResultsPanel from "./resultsPanel";
import styled from "styled-components";
import FramePanel from "./framePanel";
import EndGameModal from "./endGameModal";
import MenuBar from "./menuBar";
import useGame from "../game/useGame";
import { FrameResult, FrameResultType } from "../game/types/frameResult";
import { CurrentFrame } from "../game/types/currentFrame";
import { StepType } from "../game/types/step";

const StyledGameContainer = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 500px;
  padding: 10px;
`;

const ResultsPanelContainer = styled.div`
  max-width: 400px;
`;

function GameScreen() {
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [nbAvailablePinsToKnock, setNbAvailablePinsToKnock] = useState(NB_PINS_PER_FRAME);
  const { currentFrame, framesResults, framesScores, onUpdateCurrentFrame, onUpdateFramesResults, onUpdateFramesScores } = useGame();

  const initNextThrow = (resultType: FrameResultType, currentFrame: CurrentFrame, nbKnockedDownPins: number): void => {
    const updatedCurrentThrowResult = { throwNumber: currentFrame.throwNumber, nbKnockedDownPins: nbKnockedDownPins };
    const nextThrowResult = { throwNumber: currentFrame.throwNumber + 1, nbKnockedDownPins: 0 };
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
      resultType: FrameResultType.OPEN,
      throwsResult: [],
    });
    onUpdateFramesResults([
      ...framesResults,
      {
        frameNumber: currentFrame.frameNumber + 1,
        resultType: FrameResultType.OPEN,
        throwResults: [],
      },
    ]);
  };

  const updateFrameThrowResult = (currentFrame: CurrentFrame, frameResultType: FrameResultType, nbKnockedDownPins: number): void => {
    const currentFrameIndex = framesResults.findIndex((frameResult: FrameResult) => frameResult.frameNumber === currentFrame.frameNumber);

    const currentFrameResults = framesResults[currentFrameIndex].throwResults;
    const currentThrowResult = {
      throwNumber: currentFrame.throwNumber,
      nbKnockedDownPins: nbKnockedDownPins,
    };
    const updatedFrameResult = {
      frameNumber: currentFrame.frameNumber,
      resultType: frameResultType,
      throwResults: [...currentFrameResults, currentThrowResult],
    };
    framesResults[currentFrameIndex] = updatedFrameResult;
    onUpdateFramesResults(framesResults);
  };

  const findNextStep = (frameResultType: FrameResultType, nbKnockedDownPins: number): void => {
    const nextStep = computeNextStep(currentFrame, frameResultType, nbKnockedDownPins);
    if (nextStep.type === StepType.NEXT_FRAME) {
      initNextFrame(currentFrame);
    } else if (nextStep.type === StepType.NEXT_THROW) {
      initNextThrow(frameResultType, currentFrame, nbKnockedDownPins);
    } else {
      endGame();
    }
    setNbAvailablePinsToKnock(nextStep.nbAvailablePinsToKnock);
  };

  const submitNbKnockDownPins = (nbKnockedDownPins: number): void => {
    const frameResultType = verifyResultType(currentFrame, nbKnockedDownPins);
    updateFrameThrowResult(currentFrame, frameResultType, nbKnockedDownPins);
    computeScore(currentFrame, nbKnockedDownPins, frameResultType, framesResults, onUpdateFramesScores);
    findNextStep(frameResultType, nbKnockedDownPins);
  };

  const resetGame = (): void => {
    onUpdateCurrentFrame({ throwNumber: 1, frameNumber: 1, resultType: FrameResultType.OPEN, throwsResult: [] });
    onUpdateFramesResults([{ frameNumber: 1, resultType: FrameResultType.OPEN, throwResults: [] }]);
    onUpdateFramesScores({});
    setNbAvailablePinsToKnock(NB_PINS_PER_FRAME);
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
    <div>
      <MenuBar handleResetGame={handleResetGame} />
      <StyledGameContainer>
        <FramePanel nbAvailablePinsToKnock={nbAvailablePinsToKnock} currentFrame={currentFrame} submitNbKnockDownPins={submitNbKnockDownPins} />
        <ResultsPanelContainer>
          <ResultsPanel framesResults={framesResults} framesScores={framesScores} />
        </ResultsPanelContainer>
      </StyledGameContainer>
      <EndGameModal
        finalScore={framesScores[NB_PINS_PER_FRAME] && framesScores[NB_PINS_PER_FRAME].score}
        open={isEndGameModalOpen}
        startNewGame={startNewGame}
        handleClose={closeEndGameModal}
      />
    </div>
  );
}

export default GameScreen;
