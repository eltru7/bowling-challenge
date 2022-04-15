import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { computeScore, computeNextStep, verifyResultType } from "./game/gameRules";
import { CurrentThrow } from "./game/currentThrow";
import { FrameResultType } from "./game/frameResultType";
import { FrameResult } from "./game/frameResult";
import { Step } from "./game/step";
import usePlayerGame from "./game/usePlayerGame";

function GameScreen() {
  const [pinsInputValue, setPinsInputValue] = useState(0);
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

  const submitKnockedPinsCount = (): void => {
    // TODO logique du jeu ne devrait pas leaker dans le code du bouton
    const knockedPinsCount = Number(pinsInputValue);
    const frameResultType = verifyResultType(currentThrow, knockedPinsCount, getPreviousThrowKnockedPinsCount(currentThrow));
    updateFrameThrowResult(currentThrow, frameResultType, knockedPinsCount);
    // TODO avoid this (verify previous frame number) maybe separer en deux computeScore, compute previous score
    const previousFrameNumber = currentThrow.frameNumber - 1;
    computeScore(currentThrow, knockedPinsCount, getFrameResults(previousFrameNumber), framesScore, onUpdateFramesScore);
    findNextStep(frameResultType);
    setPinsInputValue(0);
  };

  // TODO replace any
  // TODO input can accept number between 0 and 10 only
  const handleInputChange = (event: any): void => {
    setPinsInputValue(event.target.value);
  };

  return (
    <div className="GameScreen">
      <div>{"FRAME NUMBER " + currentThrow.frameNumber}</div>
      <div>{"THROW NUMBER " + currentThrow.throwNumber}</div>

      <div>
        {framesScore.map((result: any) => (
          <div key={result.frameNumber}> {"frame # " + result.frameNumber + " " + result.score}</div>
        ))}
      </div>

      <TextField id="outlined-basic" label="Count down Pins" variant="outlined" value={pinsInputValue} onChange={handleInputChange} type="number" />
      <Button variant="contained" color="primary" onClick={submitKnockedPinsCount}>
        Submit
      </Button>
      <div>Frame score</div>
      <div>Total score</div>
    </div>
  );
}

export default GameScreen;
