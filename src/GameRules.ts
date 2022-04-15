interface FrameScore {
  frameNumber: number;
  score: number;
}

export enum FRAME_RESULT_TYPE {
  STRIKE = "STRIKE",
  SPARE = "SPARE",
  REGULAR = "REGULAR",
}

export enum Step {
  NEXT_FRAME = "NEXT_FRAME",
  NEXT_THROW = "NEXT_THROW",
  END_GAME = "END_GAME",
}

export interface CurrentThrow {
  throwNumber: number;
  frameNumber: number;
  resultType: FRAME_RESULT_TYPE;
}

const MAX_PINS_COUNT = 10;

const computePreviousFrameBonusPoint = (
  previousFrameResultType: FRAME_RESULT_TYPE,
  currentThrow: CurrentThrow,
  knockedPinsCount: number
): number => {
  let bonusPoints = 0;
  if (
    previousFrameResultType === FRAME_RESULT_TYPE.STRIKE &&
    currentThrow.throwNumber <= 2
  ) {
    bonusPoints = knockedPinsCount;
  } else if (
    previousFrameResultType === FRAME_RESULT_TYPE.SPARE &&
    currentThrow.throwNumber == 1
  ) {
    bonusPoints = knockedPinsCount;
  }
  return bonusPoints;
};

const computeCurrentFrameScore = (
  knockedPinsCount: number,
  currentThrow: CurrentThrow,
  previousFramePoints: number,
  previousFrameBonusPoints: number
): void => {
  // TODO find a better way to update object in array
  const currentFrameScoreIndex = framesScore.findIndex(
    (frameScore: FrameScore) =>
      frameScore.frameNumber === currentThrow.frameNumber
  );
  const currentFrameScore = framesScore[currentFrameScoreIndex].score;

  let updatedCurrentFrameScore = 0;
  if (currentThrow.throwNumber == 1) {
    updatedCurrentFrameScore = previousFramePoints + knockedPinsCount;
  } else {
    updatedCurrentFrameScore = currentFrameScore + previousFrameBonusPoints + knockedPinsCount;
  }

  framesScore[currentFrameScoreIndex] = {
    frameNumber: currentThrow.frameNumber,
    score: updatedCurrentFrameScore,
  };
  setFramesScore(framesScore);
};

export const verifyResultType = (
  currentThrow: CurrentThrow,
  knockedPinsCount: number,
  previousThrowKnockedPins
): FRAME_RESULT_TYPE => {
  if (
    currentThrow.resultType === FRAME_RESULT_TYPE.STRIKE ||
    currentThrow.resultType === FRAME_RESULT_TYPE.SPARE
  ) {
    return currentThrow.resultType;
  } else {
    return computeResultType(currentThrow, knockedPinsCount, previousThrowKnockedPins);
  }
};

export const computeNextStep = (currentThrow: CurrentThrow, frameResultType: FRAME_RESULT_TYPE): Step => {
  if (
    currentThrow.frameNumber < 10 &&
    frameResultType !== FRAME_RESULT_TYPE.STRIKE &&
    currentThrow.throwNumber === 1
  ) {
    return Step.NEXT_THROW;
  } else if (
    currentThrow.frameNumber === 10 &&
    frameResultType === FRAME_RESULT_TYPE.STRIKE &&
    currentThrow.throwNumber <= 2
  ) {
    return Step.NEXT_THROW;
    // tient pour acquis que compute avant que si spare, cest quon est au moins au tour 2
  } else if (
    currentThrow.frameNumber === 10 &&
    frameResultType === FRAME_RESULT_TYPE.SPARE &&
    currentThrow.throwNumber === 2
  ) {
    return Step.NEXT_THROW;
  } else if (
    currentThrow.frameNumber === 10 &&
    frameResultType !== FRAME_RESULT_TYPE.STRIKE &&
    frameResultType !== FRAME_RESULT_TYPE.SPARE &&
    currentThrow.throwNumber === 1
  ) {
    return Step.NEXT_THROW;
  } else if (
    currentThrow.frameNumber < 10 &&
    frameResultType === FRAME_RESULT_TYPE.STRIKE
  ) {
    return Step.NEXT_FRAME;
  } else if (
    currentThrow.frameNumber < 10 &&
    currentThrow.throwNumber === 2
  ) {
    return Step.NEXT_FRAME;
  } else {
    return Step.END_GAME;
  }
};

const computeResultType = (
  currentThrow: CurrentThrow,
  knockedPinsCount: number,
  previousThrowKnockedPinsCount: number
): FRAME_RESULT_TYPE => {
  if (currentThrow.throwNumber === 1 && knockedPinsCount === MAX_PINS_COUNT) {
    return FRAME_RESULT_TYPE.STRIKE;
  } else if (
    currentThrow.throwNumber === 2 &&
    previousThrowKnockedPinsCount + knockedPinsCount ===
    MAX_PINS_COUNT
  ) {
    return FRAME_RESULT_TYPE.SPARE;
  }
  return FRAME_RESULT_TYPE.REGULAR;
};

// TODO passer en param a cette function previousThrow type
export const computeScore = (
  currentThrow: CurrentThrow,
  knockedPinsCount: number,
): void => {
  // not take for granted that our results are in order (frame 1, 2, etc, )
  let bonusPoint = 0;
  let updatedPreviousFrameScore = 0;

  if (currentThrow.frameNumber > 1) {
    // recompute le previous score
    const previousFrameNumber = currentThrow.frameNumber - 1;
    const previousFrameScoreIndex = framesScore.findIndex(
      (frameScore: FrameScore) =>
        frameScore.frameNumber === previousFrameNumber
    );
    const previousFrameScore = framesScore[previousFrameScoreIndex];

    const previousFrameResult = getFrameResults(previousFrameNumber);
    bonusPoint = computePreviousFrameBonusPoint(
      previousFrameResult.resultType,
      currentThrow,
      knockedPinsCount
    );
    // TODO find a better way to update object in array

    updatedPreviousFrameScore = bonusPoint + previousFrameScore.score;
    framesScore[previousFrameScoreIndex] = {
      frameNumber: previousFrameNumber,
      score: updatedPreviousFrameScore,
    };
    setFramesScore(framesScore);
  }
  computeCurrentFrameScore(
    knockedPinsCount,
    currentThrow,
    updatedPreviousFrameScore,
    bonusPoint
  );
};