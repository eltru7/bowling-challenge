import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import {FRAME_RESULT_TYPE, Step, computeScore, CurrentThrow, computeNextStep, verifyResultType, FRAME_RESULT_TYPE} from "./GameRules";


function GameScreen() {
  interface ThrowResult {
    throwNumber: number;
    knockedPinsCount: number;
  }

  interface FrameResult {
    frameNumber: number;
    resultType: FRAME_RESULT_TYPE;
    throwResults: ThrowResult[];
  }

  const [currentThrow, setCurrentThrow] = useState({
    throwNumber: 1,
    frameNumber: 1,
    resultType: FRAME_RESULT_TYPE.REGULAR,
  });
  const [framesScore, setFramesScore] = useState([
    { frameNumber: 1, score: 0 },
  ]);
  const [framesResults, setFramesResults] = useState([
    { frameNumber: 1, resultType: FRAME_RESULT_TYPE.REGULAR, throwResults: [] },
  ] as FrameResult[]);
  const [pinsInputValue, setPinsInputValue] = useState(0);

  const updateFrameThrowResult = (
    currentThrow: CurrentThrow,
    frameResultType: FRAME_RESULT_TYPE,
    knockedPinsCount: number
  ): void => {
    const currentFrameIndex = framesResults.findIndex(
      (frameResult: FrameResult) =>
        frameResult.frameNumber === currentThrow.frameNumber
    );

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
    setFramesResults(framesResults);
  };

  // what to do when this append, find can return undefined
  // TODO replace with throw error and catch it later
  const getFrameResults = (frameNumber: number): FrameResult => {
    const results = framesResults.find(
      (frameResult: FrameResult) => frameResult.frameNumber === frameNumber
    );
    if (results) {
      return results;
    }
    return {
      frameNumber: 0,
      resultType: FRAME_RESULT_TYPE.REGULAR,
      throwResults: [],
    };
  };

  const getPreviousThrowKnockedPinsCount = (
    currentThrow: CurrentThrow
  ): number => {
    // prend pour acquis que le current throw number == 2 a cause du if dans lequel est appele la methode
    const currentFrameResults = getFrameResults(currentThrow.frameNumber);
    const previousThrowKnockedPinsCount =
      currentFrameResults.throwResults[0].knockedPinsCount;
    return previousThrowKnockedPinsCount;
  };

  const initNextFrame = (currentThrow: CurrentThrow): void => {
    // no need to verify if 10th frame end game because already verify before, should we verify it quand meme?
    setCurrentThrow({
      throwNumber: 1,
      frameNumber: currentThrow.frameNumber + 1,
      resultType: FRAME_RESULT_TYPE.REGULAR,
    });
    setFramesResults([
      ...framesResults,
      {
        frameNumber: currentThrow.frameNumber + 1,
        resultType: FRAME_RESULT_TYPE.REGULAR,
        throwResults: [],
      },
    ]);

    setFramesScore([
      ...framesScore,
      { frameNumber: currentThrow.frameNumber + 1, score: 0 },
    ]);
  };

  const initNextThrow = (
    resultType: FRAME_RESULT_TYPE,
    currentThrow: CurrentThrow
  ): void => {
    setCurrentThrow({
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

  const findNextStep = (frameResultType: FRAME_RESULT_TYPE): void => {
    const nextStep = computeNextStep(currentThrow, frameResultType);
    if (nextStep === Step.NEXT_FRAME) {
      initNextFrame(currentThrow);
    } else if (nextStep === Step.NEXT_THROW) {
      initNextThrow(frameResultType, currentThrow)
    } else {
      endGame();
    }
  };

  const submitKnockedPinsCount = (): void => {
    const knockedPinsCount = Number(pinsInputValue);
    const frameResultType = verifyResultType(
      currentThrow,
      knockedPinsCount,
      getPreviousThrowKnockedPinsCount(currentThrow)
    );
    updateFrameThrowResult(currentThrow, frameResultType, knockedPinsCount);
    computeScore(currentThrow, knockedPinsCount);
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
          <div key={result.frameNumber}>
            {" "}
            {"frame # " + result.frameNumber + " " + result.score}
          </div>
        ))}
      </div>

      <TextField
        id="outlined-basic"
        label="Count down Pins"
        variant="outlined"
        value={pinsInputValue}
        onChange={handleInputChange}
        type="number"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={submitKnockedPinsCount}
      >
        Submit
      </Button>
      <div>Frame score</div>
      <div>Total score</div>
    </div>
  );
}

export default GameScreen;
