import { useState } from "react";
import { FrameResultType } from "./frameResultType";
import { FrameResult } from "./frameResult";
import { CurrentThrow } from "./currentThrow";
import { FrameScore } from "./frameScore";

type GameHook = {
  currentThrow: any;
  framesResults: any;
  framesScore: any;
  getFrameResults: any;
  onUpdateCurrentThrow: any;
  onUpdateFrameResult: any;
  onUpdateFramesScore: any;
};

const usePlayerGame = (): any => {
  const [currentThrow, setCurrentThrow] = useState({
    throwNumber: 1,
    frameNumber: 1,
    resultType: FrameResultType.REGULAR,
  });

  const [framesScore, setFramesScore] = useState([{ frameNumber: 1, score: 0 }]);

  const [framesResults, setFramesResults] = useState([{ frameNumber: 1, resultType: FrameResultType.REGULAR, throwResults: [] }] as FrameResult[]);

  const onUpdateCurrentThrow = (updatedCurrentThrow: CurrentThrow): void => {
    setCurrentThrow(updatedCurrentThrow);
  };

  const onUpdateFramesResults = (updatedFramesResults: FrameResult[]): void => {
    setFramesResults(updatedFramesResults);
  };

  const onUpdateFramesScore = (updatedFramesScore: FrameScore[]): void => {
    setFramesScore(updatedFramesScore);
  };

  // what to do when this append, find can return undefined
  // TODO replace with throw error and catch it later
  const getFrameResults = (frameNumber: number): FrameResult => {
    const results = framesResults.find((frameResult: FrameResult) => frameResult.frameNumber === frameNumber);
    if (results) {
      return results;
    }
    return {
      frameNumber: 0,
      resultType: FrameResultType.REGULAR,
      throwResults: [],
    };
  };

  return {
    currentThrow,
    framesResults,
    framesScore,
    getFrameResults,
    onUpdateCurrentThrow,
    onUpdateFramesResults,
    onUpdateFramesScore,
  };
};

export default usePlayerGame;
