import { useState } from "react";
import { CurrentFrame } from "./types/currentFrame";
import { FrameResult, FrameResultType } from "./types/frameResult";
import { FramesScores } from "./types/framesScores";

type GameHook = {
  currentFrame: CurrentFrame;
  framesResults: FrameResult[];
  framesScores: FramesScores;
  onUpdateCurrentFrame: (currentFrame: CurrentFrame) => void;
  onUpdateFramesResults: (updatedFramesResults: FrameResult[]) => void;
  onUpdateFramesScores: (updatedFramesScores: FramesScores) => void;
};

const useGame = (): GameHook => {
  const [currentFrame, setCurrentFrame] = useState({
    frameNumber: 1,
    throwNumber: 1,
    resultType: FrameResultType.OPEN,
    throwsResult: [{ throwNumber: 1, nbKnockedDownPins: 0 }],
  });

  const [framesScores, setFramesScores] = useState({});

  const [framesResults, setFramesResults] = useState([{ frameNumber: 1, resultType: FrameResultType.OPEN, throwResults: [] }] as FrameResult[]);

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

export default useGame;
