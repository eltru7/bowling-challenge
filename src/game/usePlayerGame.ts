import { useState } from "react";
import { FrameResultType } from "./frameResultType";
import { FrameResult } from "./frameResult";
import { FramesScores } from "./frameScore";
import { CurrentFrame } from "./currentFrame";

type GameHook = {
  currentFrame: CurrentFrame;
  framesResults: FrameResult[];
  framesScores: FramesScores;
  onUpdateCurrentFrame: (currentFrame: CurrentFrame) => void;
  onUpdateFramesResults: (updatedFramesResults: FrameResult[]) => void;
  onUpdateFramesScores: (updatedFramesScores: FramesScores) => void;
};

const usePlayerGame = (): GameHook => {
  const [currentFrame, setCurrentFrame] = useState({
    frameNumber: 1,
    throwNumber: 1,
    resultType: FrameResultType.REGULAR,
    throwsResult: [{ throwNumber: 1, knockedPinsCount: 0 }],
  });

  const [framesScores, setFramesScores] = useState({});

  const [framesResults, setFramesResults] = useState([{ frameNumber: 1, resultType: FrameResultType.REGULAR, throwResults: [] }] as FrameResult[]);

  const onUpdateCurrentFrame = (updatedCurrentFrame: CurrentFrame): void => {
    setCurrentFrame(updatedCurrentFrame);
  };

  const onUpdateFramesResults = (updatedFramesResults: FrameResult[]): void => {
    setFramesResults(updatedFramesResults);
  };

  const onUpdateFramesScores = (updatedFramesScores: FramesScores): void => {
    setFramesScores(updatedFramesScores);
  };

  return {
    currentFrame,
    framesResults,
    framesScores,
    onUpdateCurrentFrame,
    onUpdateFramesResults,
    onUpdateFramesScores,
  };
};

export default usePlayerGame;
