interface FrameScore {
  frameNumber: number;
  score: number;
  nbThrowsLeftForBonusPoints: number;
}

export interface FramesScores {
  [frameNumber: number]: {
    frameScore: FrameScore;
  };
}
