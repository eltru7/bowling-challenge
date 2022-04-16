import { FrameResultType } from "./frameResultType";
import { CurrentFrame } from "./currentFrame";
import { Step, StepType } from "./step";
import { FramesScores } from "./frameScore";
import { FrameResult } from "./frameResult";

export const NB_PINS_PER_FRAME = 10;

const computeResultType = (currentFrame: CurrentFrame, knockedPinsCount: number): FrameResultType => {
  if (currentFrame.throwNumber === 1 && knockedPinsCount === NB_PINS_PER_FRAME) {
    return FrameResultType.STRIKE;
  } else if (currentFrame.throwNumber === 2 && currentFrame.throwsResult[0].knockedPinsCount + knockedPinsCount === NB_PINS_PER_FRAME) {
    return FrameResultType.SPARE;
  }
  return FrameResultType.REGULAR;
};

export const verifyResultType = (currentFrame: CurrentFrame, knockedPinsCount: number): FrameResultType => {
  if (currentFrame.resultType === FrameResultType.STRIKE || currentFrame.resultType === FrameResultType.SPARE) {
    return currentFrame.resultType;
  } else {
    return computeResultType(currentFrame, knockedPinsCount);
  }
};

export const computeNextStep = (currentFrame: CurrentFrame, frameResultType: FrameResultType, nbKnockedDownPins: number): Step => {
  if (currentFrame.frameNumber < 10 && frameResultType !== FrameResultType.STRIKE && currentFrame.throwNumber === 1) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME - nbKnockedDownPins };
  } else if (currentFrame.frameNumber === 10 && frameResultType === FrameResultType.STRIKE && currentFrame.throwNumber === 1) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME };
  } else if (currentFrame.frameNumber === 10 && frameResultType === FrameResultType.STRIKE && currentFrame.throwNumber === 2) {
    return { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: NB_PINS_PER_FRAME - nbKnockedDownPins };
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

/*******************************************************************************************************************
 **************************************************************************************************************************************/

const computePreviousFrameBonusPoint = (previousFrameResultType: FrameResultType, currentFrame: CurrentFrame, knockedPinsCount: number): number => {
  let bonusPoints = 0;
  /* if (previousFrameResultType === FrameResultType.STRIKE && currentThrow.throwNumber <= 2) {
    bonusPoints = knockedPinsCount;
  } else if (previousFrameResultType === FrameResultType.SPARE && currentThrow.throwNumber === 1) {
    bonusPoints = knockedPinsCount;
  } */
  return bonusPoints;
};

/*const computeCurrentFrameScore = (
  knockedPinsCount: number,
  currentFrame: CurrentFrame,
  previousFramePoints: number,
  previousFrameBonusPoints: number,
  framesScore: any,
  onUpdateFramesScore: any
): void => {
  // TODO find a better way to update object in array
  const currentFrameScoreIndex = framesScore.findIndex((frameScore: FrameScore) => frameScore.frameNumber === currentFrame.frameNumber);
  const currentFrameScore = framesScore[currentFrameScoreIndex].score;

  let updatedCurrentFrameScore = 0;
  if (currentFrame.throwNumber === 1) {
    updatedCurrentFrameScore = previousFramePoints + knockedPinsCount;
  } else {
    updatedCurrentFrameScore = currentFrameScore + previousFrameBonusPoints + knockedPinsCount;
  }

  framesScore[currentFrameScoreIndex] = {
    frameNumber: currentFrame.frameNumber,
    score: updatedCurrentFrameScore,
  };
  onUpdateFramesScore(framesScore);
}; */

export const computeScore = (
  currentFrame: CurrentFrame,
  knockedPinsCount: number,
  frameResultType: FrameResultType,
  framesResults: FrameResult[],
  framesScore: FramesScores,
  onUpdateFramesScore: any
): void => {
  // update previous frame => if strike or spare
  // update previous frame => score if previous has changed
  // compute current frame score
  if (currentFrame.frameNumber > 1) {
    console.log("alo");
    // TODO updatePreviousFramesScore();
  }

  //updateCurrentFrameScore();

  /***********************
   ********************/

  let updatedFramesScore = []; // TODO deep copy of framesScore

  let bonusPoint = 0;
  let updatedPreviousFrameScore = 0;

  if (currentFrame.frameNumber > 1) {
    // recompute le previous score
    //const previousFrameNumber = currentFrame.frameNumber - 1;
    //const previousFrameScoreIndex = framesScore.findIndex((frameScore: FrameScore) => frameScore.frameNumber === previousFrameNumber);
    //const previousFrameScore = framesScore[previousFrameScoreIndex];

    bonusPoint = 0; // computePreviousFrameBonusPoint(previousFrameResult.resultType, currentFrame, knockedPinsCount);
    // TODO find a better way to update object in array

    /*updatedPreviousFrameScore = bonusPoint + previousFrameScore.score;
    framesScore[previousFrameScoreIndex] = {
      frameNumber: previousFrameNumber,
      score: updatedPreviousFrameScore,
    }; */
    onUpdateFramesScore(framesScore);
  }
  //computeCurrentFrameScore(knockedPinsCount, currentFrame, updatedPreviousFrameScore, bonusPoint, framesScore, onUpdateFramesScore);
};
