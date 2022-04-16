import React, { useState } from "react";
import { computeScore, computeNextStep, verifyResultType } from "../game/gameRules";
import { CurrentThrow } from "../game/currentThrow";
import { FrameResultType } from "../game/frameResultType";
import { FrameResult } from "../game/frameResult";
import { Step } from "../game/step";
import usePlayerGame from "../game/usePlayerGame";
import ResultsPanel from "./resultsPanel";
import styled from "styled-components";
import FramePanel from "./framePanel";

const StyledContainer = styled.div`
  padding: 30px;
  display: flex;
  justify-content: space-between;
`;

const ResultsPanelContainer = styled.div`
  max-width: 400px;
`;

function GameScreen() {
  const { currentThrow, framesResults, framesScore, getFrameResults, onUpdateCurrentThrow, onUpdateFramesResults, onUpdateFramesScore } = usePlayerGame();

  const updateFrameThrowResult = (currentThrow: CurrentThrow, frameResultType: FrameResultType, knockedPinsCount: number): void => {
    const currentFrameIndex = framesResults.findIndex((frameResult: FrameResult) => frameResult.frameNumber === currentThrow.frameNumber);

    const currentFrameResults = framesResults[currentFrameIndex].throwResults;
    const currentThrowResult = {
      throwNumber: currentThrow.throwNumber,
      knockedPinsCount: knockedPinsCount,
    };
    const updatedFrameResult = {
      frameNumber: currentThrow.frameNumber,
      resultType: frameResultType,
      throwResults: [...currentFrameResults, currentThrowResult],
    };
    framesResults[currentFrameIndex] = updatedFrameResult;
    onUpdateFramesResults(framesResults);
  };

  const getPreviousThrowKnockedPinsCount = (currentThrow: CurrentThrow): number => {
    // prend pour acquis que le current throw number == 2 a cause du if dans lequel est appele la methode
    let previousThrowKnockedPinsCount = 0;
    if (currentThrow.throwNumber >= 2) {
      const currentFrameResults = getFrameResults(currentThrow.frameNumber);
      previousThrowKnockedPinsCount = currentFrameResults.throwResults[0].knockedPinsCount;
    }
    return previousThrowKnockedPinsCount;
  };

  const initNextFrame = (currentThrow: CurrentThrow): void => {
    // no need to verify if 10th frame end game because already verify before, should we verify it quand meme?
    onUpdateCurrentThrow({
      throwNumber: 1,
      frameNumber: currentThrow.frameNumber + 1,
      resultType: FrameResultType.REGULAR,
    });
    onUpdateFramesResults([
      ...framesResults,
      {
        frameNumber: currentThrow.frameNumber + 1,
        resultType: FrameResultType.REGULAR,
        throwResults: [],
      },
    ]);

    onUpdateFramesScore([...framesScore, { frameNumber: currentThrow.frameNumber + 1, score: 0 }]);
  };

  const initNextThrow = (resultType: FrameResultType, currentThrow: CurrentThrow): void => {
    onUpdateCurrentThrow({
      ...currentThrow,
      throwNumber: currentThrow.throwNumber + 1,
      resultType: resultType,
    });
  };

  const endGame = (): void => {
    console.log("END GAME");
    // pop up with final score + start new game
    // disable input and submit button
  };

  const findNextStep = (frameResultType: FrameResultType): void => {
    const nextStep = computeNextStep(currentThrow, frameResultType);
    if (nextStep === Step.NEXT_FRAME) {
      initNextFrame(currentThrow);
    } else if (nextStep === Step.NEXT_THROW) {
      initNextThrow(frameResultType, currentThrow);
    } else {
      endGame();
    }
  };

  const submitKnockedPinsCount = (knockedPinsCount: number): void => {
    // TODO logique du jeu ne devrait pas leaker dans le code du bouton
    const frameResultType = verifyResultType(currentThrow, knockedPinsCount, getPreviousThrowKnockedPinsCount(currentThrow));
    updateFrameThrowResult(currentThrow, frameResultType, knockedPinsCount);
    // TODO avoid this (verify previous frame number) maybe separer en deux computeScore, compute previous score
    const previousFrameNumber = currentThrow.frameNumber - 1;
    computeScore(currentThrow, knockedPinsCount, getFrameResults(previousFrameNumber), framesScore, onUpdateFramesScore);
    findNextStep(frameResultType);
  };

  return (
    <div className="GameScreen">
      <StyledContainer>
        <FramePanel currentThrow={currentThrow} submitKnockedPinsCount={submitKnockedPinsCount} />
        <ResultsPanelContainer>
          <ResultsPanel framesResults={framesResults} framesScore={framesScore} />
        </ResultsPanelContainer>
      </StyledContainer>
    </div>
  );
}

export default GameScreen;
