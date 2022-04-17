import { FrameResultType } from "./frameResultType";
import { CurrentFrame } from "./currentFrame";
import { Step, StepType } from "./step";
import { FramesScores } from "./frameScore";
import { FrameResult } from "./frameResult";
import _ from "lodash";

export const NB_PINS_PER_FRAME = 10;
const STRIKE_NB_BONUS_THROWS = 2;
const SPARE_NB_BONUS_THROWS = 1;

const computeResultType = (currentFrame: CurrentFrame, nbKnockedDownPins: number): FrameResultType => {
  if (currentFrame.throwNumber === 1 && nbKnockedDownPins === NB_PINS_PER_FRAME) {
    return FrameResultType.STRIKE;
  } else if (currentFrame.throwNumber === 2 && currentFrame.throwsResult[0].nbKnockedDownPins + nbKnockedDownPins === NB_PINS_PER_FRAME) {
    return FrameResultType.SPARE;
  }
  return FrameResultType.OPEN;
};

export const verifyResultType = (currentFrame: CurrentFrame, nbKnockedDownPins: number): FrameResultType => {
  if (currentFrame.resultType === FrameResultType.STRIKE || currentFrame.resultType === FrameResultType.SPARE) {
    return currentFrame.resultType;
  } else {
    return computeResultType(currentFrame, nbKnockedDownPins);
  }
};

export const computeNextStep = (currentFrame: CurrentFrame, frameResultType: FrameResultType, nbKnockedDownPins: number): Step => {
  if (currentFrame.frameNumber < 10 && frameResultType !== FrameResultType.STRIKE && currentFrame.throwNumber === 1) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME - nbKnockedDownPins };
  } else if (currentFrame.frameNumber === 10 && frameResultType === FrameResultType.STRIKE && currentFrame.throwNumber <= 2) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME };
  } else if (currentFrame.frameNumber === 10 && frameResultType === FrameResultType.SPARE && currentFrame.throwNumber === 2) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME };
  } else if (currentFrame.frameNumber === 10 && frameResultType !== FrameResultType.STRIKE && frameResultType !== FrameResultType.SPARE && currentFrame.throwNumber === 1) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME - nbKnockedDownPins };
  } else if (currentFrame.frameNumber < 10 && frameResultType === FrameResultType.STRIKE) {
    return { type: StepType.NEXT_FRAME, nbAvailablePinsToKnock: 10 };
  } else if (currentFrame.frameNumber < 10 && currentFrame.throwNumber === 2) {
    return { type: StepType.NEXT_FRAME, nbAvailablePinsToKnock: 10 };
  } else {
    return { type: StepType.END_GAME, nbAvailablePinsToKnock: 0 };
  }
};

const findPreviousFrameScore = (frameResult: FrameResult, framesScores: FramesScores): number => {
  let previousFrameScore = 0;
  if (frameResult.frameNumber > 1) {
    const previousFrameNumber = frameResult.frameNumber - 1;
    previousFrameScore = framesScores[previousFrameNumber].score;
  }
  return previousFrameScore;
};

const getNextThrowNbKnockedDownPins = (nbBonusThrows: number, frameResult: FrameResult, framesResults: FrameResult[]): number => {
  let bonusPoints = 0;
  const allFramesThrows = [];

  for (const frameResult of framesResults) {
    for (const throwResult of frameResult.throwResults) {
      allFramesThrows.push({ frameNumber: frameResult.frameNumber, ...throwResult });
    }
  }
  const lastThrowNumber = frameResult.resultType === FrameResultType.STRIKE ? 1 : 2;
  const indexOfFrameResult = allFramesThrows.findIndex((throwResult) => throwResult.frameNumber === frameResult.frameNumber && throwResult.throwNumber === lastThrowNumber);
  if (indexOfFrameResult + 1 <= allFramesThrows.length - 1) {
    for (let nextThrowIndex = indexOfFrameResult + 1; nextThrowIndex <= indexOfFrameResult + nbBonusThrows; nextThrowIndex++) {
      let points = allFramesThrows[nextThrowIndex] ? allFramesThrows[nextThrowIndex].nbKnockedDownPins : 0;
      bonusPoints += points;
    }
  }

  return bonusPoints;
};

const computeBonusPoints = (frameResult: FrameResult, framesResults: FrameResult[]): number => {
  let bonusPoints = 0;
  if (frameResult.resultType === FrameResultType.STRIKE) {
    bonusPoints = getNextThrowNbKnockedDownPins(STRIKE_NB_BONUS_THROWS, frameResult, framesResults);
  } else if (frameResult.resultType === FrameResultType.SPARE) {
    bonusPoints = getNextThrowNbKnockedDownPins(SPARE_NB_BONUS_THROWS, frameResult, framesResults);
  }
  return bonusPoints;
};

export const computeScore = (
  currentFrame: CurrentFrame,
  nbKnockedDownPins: number,
  frameResultType: FrameResultType,
  framesResults: FrameResult[],
  onUpdateFramesScore: (framesScores: FramesScores) => void
): void => {
  let updatedFramesScores = {};

  for (const frameResult of framesResults) {
    let currentFrameSumPoints = _.sumBy(framesResults[frameResult.frameNumber - 1].throwResults, "nbKnockedDownPins");
    let previousFrameScore = findPreviousFrameScore(frameResult, updatedFramesScores);
    let bonusPoints = computeBonusPoints(frameResult, framesResults);
    const updatedFramePoints = currentFrameSumPoints + previousFrameScore + bonusPoints;
    const updatedFrameScore = { [frameResult.frameNumber]: { score: updatedFramePoints } };
    updatedFramesScores = { ...updatedFramesScores, ...updatedFrameScore };
  }

  onUpdateFramesScore(updatedFramesScores);
};
