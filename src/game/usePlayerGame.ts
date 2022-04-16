import { useState } from "react";
import { FrameResultType } from "./frameResultType";
import { FrameResult } from "./frameResult";
import { FrameScore } from "./frameScore";
import { CurrentFrame } from "./currentFrame";

type GameHook = {
  currentFrame: CurrentFrame;
  framesResults: FrameResult[];
  framesScore: FrameScore[];
  getFrameResults: (frameNumber: number) => FrameResult;
  onUpdateCurrentFrame: (currentFrame: CurrentFrame) => void;
  onUpdateFramesResults: (frameResult: FrameResult[]) => void;
  onUpdateFramesScore: (framesScore: FrameScore[]) => void;
};

const usePlayerGame = (): GameHook => {
  const [currentFrame, setCurrentFrame] = useState({
    frameNumber: 1,
    throwNumber: 1,
    resultType: FrameResultType.REGULAR,
    throwsResult: [{ throwNumber: 1, knockedPinsCount: 0 }],
  });

  const [framesScore, setFramesScore] = useState([{ frameNumber: 1, score: 0 }]);

  const [framesResults, setFramesResults] = useState([{ frameNumber: 1, resultType: FrameResultType.REGULAR, throwResults: [] }] as FrameResult[]);

  const onUpdateCurrentFrame = (updatedCurrentFrame: CurrentFrame): void => {
    setCurrentFrame(updatedCurrentFrame);
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
    currentFrame,
    framesResults,
    framesScore,
    getFrameResults,
    onUpdateCurrentFrame,
    onUpdateFramesResults,
    onUpdateFramesScore,
  };
};

export default usePlayerGame;
