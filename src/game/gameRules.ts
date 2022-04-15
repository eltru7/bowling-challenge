import { FrameResultType } from "./frameResultType";
import { CurrentThrow } from "./currentThrow";
import { Step } from "./step";
import { FrameScore } from "./frameScore";
import { FrameResult } from "./frameResult";

const MAX_PINS_COUNT = 10;

const computePreviousFrameBonusPoint = (previousFrameResultType: FrameResultType, currentThrow: CurrentThrow, knockedPinsCount: number): number => {
  let bonusPoints = 0;
  if (previousFrameResultType === FrameResultType.STRIKE && currentThrow.throwNumber <= 2) {
    bonusPoints = knockedPinsCount;
  } else if (previousFrameResultType === FrameResultType.SPARE && currentThrow.throwNumber === 1) {
    bonusPoints = knockedPinsCount;
  }
  return bonusPoints;
};

const computeCurrentFrameScore = (
  knockedPinsCount: number,
  currentThrow: CurrentThrow,
  previousFramePoints: number,
  previousFrameBonusPoints: number,
  framesScore: any,
  onUpdateFramesScore: any
): void => {
  // TODO find a better way to update object in array
  const currentFrameScoreIndex = framesScore.findIndex((frameScore: FrameScore) => frameScore.frameNumber === currentThrow.frameNumber);
  const currentFrameScore = framesScore[currentFrameScoreIndex].score;

  let updatedCurrentFrameScore = 0;
  if (currentThrow.throwNumber === 1) {
    updatedCurrentFrameScore = previousFramePoints + knockedPinsCount;
  } else {
    updatedCurrentFrameScore = currentFrameScore + previousFrameBonusPoints + knockedPinsCount;
  }

  framesScore[currentFrameScoreIndex] = {
    frameNumber: currentThrow.frameNumber,
    score: updatedCurrentFrameScore,
  };
  onUpdateFramesScore(framesScore);
};

export const verifyResultType = (currentThrow: CurrentThrow, knockedPinsCount: number, previousThrowKnockedPins: number): FrameResultType => {
  if (currentThrow.resultType === FrameResultType.STRIKE || currentThrow.resultType === FrameResultType.SPARE) {
    return currentThrow.resultType;
  } else {
    return computeResultType(currentThrow, knockedPinsCount, previousThrowKnockedPins);
  }
};

export const computeNextStep = (currentThrow: CurrentThrow, frameResultType: FrameResultType): Step => {
  if (currentThrow.frameNumber < 10 && frameResultType !== FrameResultType.STRIKE && currentThrow.throwNumber === 1) {
    return Step.NEXT_THROW;
  } else if (currentThrow.frameNumber === 10 && frameResultType === FrameResultType.STRIKE && currentThrow.throwNumber <= 2) {
    return Step.NEXT_THROW;
    // tient pour acquis que compute avant que si spare, cest quon est au moins au tour 2
  } else if (currentThrow.frameNumber === 10 && frameResultType === FrameResultType.SPARE && currentThrow.throwNumber === 2) {
    return Step.NEXT_THROW;
  } else if (currentThrow.frameNumber === 10 && frameResultType !== FrameResultType.STRIKE && frameResultType !== FrameResultType.SPARE && currentThrow.throwNumber === 1) {
    return Step.NEXT_THROW;
  } else if (currentThrow.frameNumber < 10 && frameResultType === FrameResultType.STRIKE) {
    return Step.NEXT_FRAME;
  } else if (currentThrow.frameNumber < 10 && currentThrow.throwNumber === 2) {
    return Step.NEXT_FRAME;
  } else {
    return Step.END_GAME;
  }
};

const computeResultType = (currentThrow: CurrentThrow, knockedPinsCount: number, previousThrowKnockedPinsCount: number): FrameResultType => {
  if (currentThrow.throwNumber === 1 && knockedPinsCount === MAX_PINS_COUNT) {
    return FrameResultType.STRIKE;
  } else if (currentThrow.throwNumber === 2 && previousThrowKnockedPinsCount + knockedPinsCount === MAX_PINS_COUNT) {
    return FrameResultType.SPARE;
  }
  return FrameResultType.REGULAR;
};

// TODO passer en param a cette function previousThrow type
export const computeScore = (currentThrow: CurrentThrow, knockedPinsCount: number, previousFrameResult: FrameResult, framesScore: any, onUpdateFramesScore: any): void => {
  // not take for granted that our results are in order (frame 1, 2, etc, )
  let bonusPoint = 0;
  let updatedPreviousFrameScore = 0;

  if (currentThrow.frameNumber > 1) {
    // recompute le previous score
    const previousFrameNumber = currentThrow.frameNumber - 1;
    const previousFrameScoreIndex = framesScore.findIndex((frameScore: FrameScore) => frameScore.frameNumber === previousFrameNumber);
    const previousFrameScore = framesScore[previousFrameScoreIndex];

    bonusPoint = computePreviousFrameBonusPoint(previousFrameResult.resultType, currentThrow, knockedPinsCount);
    // TODO find a better way to update object in array

    updatedPreviousFrameScore = bonusPoint + previousFrameScore.score;
    framesScore[previousFrameScoreIndex] = {
      frameNumber: previousFrameNumber,
      score: updatedPreviousFrameScore,
    };
    onUpdateFramesScore(framesScore);
  }
  computeCurrentFrameScore(knockedPinsCount, currentThrow, updatedPreviousFrameScore, bonusPoint, framesScore, onUpdateFramesScore);
};
