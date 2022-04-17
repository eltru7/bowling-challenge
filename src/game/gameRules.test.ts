import { computeNextStep, computeScore, NB_PINS_PER_FRAME, verifyResultType } from "./gameRules";
import { FrameResultType, StepType } from "./types";

describe("GameRules", () => {
  describe("when computing the result type", () => {
    describe("when all pins are knocked down during first throw", () => {
      const nbKnockedDownPins = NB_PINS_PER_FRAME;
      const currentFrame = { frameNumber: 1, throwNumber: 1, resultType: FrameResultType.OPEN, throwsResult: [] };

      it("should return the right result type", () => {
        const resultType = verifyResultType(currentFrame, nbKnockedDownPins);
        const expectedResultType = FrameResultType.STRIKE;

        expect(resultType).toBe(expectedResultType);
      });
    });

    describe("when all pins are knocked down after second throw", () => {
      const nbKnockedDownPins = 4;
      const currentFrame = { frameNumber: 1, throwNumber: 2, resultType: FrameResultType.OPEN, throwsResult: [{ throwNumber: 1, nbKnockedDownPins: 6 }] };

      it("should return the right result type", () => {
        const expectedResultType = FrameResultType.SPARE;
        const resultType = verifyResultType(currentFrame, nbKnockedDownPins);

        expect(resultType).toBe(expectedResultType);
      });
    });
  });

  describe("when computing the next step", () => {
    describe("when it is not the last frame of the game", () => {
      describe("when it is the first throw", () => {
        describe("when the result type is a strike", () => {
          const currentFrame = { frameNumber: 1, throwNumber: 1, resultType: FrameResultType.OPEN, throwsResult: [] };
          const nbKnockedDownPinsFirstThrow = 10;

          it("should return the right step", () => {
            const expectedNbAvailablePinsToKnock = NB_PINS_PER_FRAME;
            const expectedNextStep = { type: StepType.NEXT_FRAME, nbAvailablePinsToKnock: expectedNbAvailablePinsToKnock };

            const nextStep = computeNextStep(currentFrame, FrameResultType.STRIKE, nbKnockedDownPinsFirstThrow);

            expect(nextStep).toStrictEqual(expectedNextStep);
          });
        });

        describe("when the result type is open", () => {
          const currentFrame = { frameNumber: 1, throwNumber: 1, resultType: FrameResultType.OPEN, throwsResult: [] };
          const nbKnockedDownPinsFirstThrow = 3;

          it("should return the right step", () => {
            const expectedNbAvailablePinsToKnock = NB_PINS_PER_FRAME - nbKnockedDownPinsFirstThrow;
            const expectedNextStep = { type: StepType.NEXT_THROW, nbAvailablePinsToKnock: expectedNbAvailablePinsToKnock };

            const nextStep = computeNextStep(currentFrame, FrameResultType.OPEN, nbKnockedDownPinsFirstThrow);

            expect(nextStep).toStrictEqual(expectedNextStep);
          });
        });
      });
    });
  });

  describe("when computing the score", () => {
    const onUpdateFramesScore = jest.fn();

    describe("when the frame result is a strike", () => {
      const firstFrameFirstThrowNbPins = NB_PINS_PER_FRAME;
      const secondFrameFirstThrowNbPins = 2;
      const secondFrameSecondThrowNbPins = 3;
      const currentFrame = { frameNumber: 2, throwNumber: 2, resultType: FrameResultType.OPEN, throwsResult: [{ throwNumber: 1, nbKnockedDownPins: secondFrameFirstThrowNbPins }] };
      const framesResults = [
        { frameNumber: 1, resultType: FrameResultType.STRIKE, throwResults: [{ throwNumber: 1, nbKnockedDownPins: firstFrameFirstThrowNbPins }] },
        {
          frameNumber: 2,
          resultType: FrameResultType.OPEN,
          throwResults: [
            { throwNumber: 1, nbKnockedDownPins: secondFrameFirstThrowNbPins },
            { throwNumber: 2, nbKnockedDownPins: secondFrameSecondThrowNbPins },
          ],
        },
      ];

      it("should return the right frame score with bonus points", () => {
        const expectedScoreFirstFrame = 15;
        const expectedScoreSecondFrame = 20;
        const expectedScore = { 1: { score: expectedScoreFirstFrame }, 2: { score: expectedScoreSecondFrame } };

        computeScore(currentFrame, secondFrameSecondThrowNbPins, FrameResultType.STRIKE, framesResults, onUpdateFramesScore);

        expect(onUpdateFramesScore).toBeCalledWith(expectedScore);
      });
    });
  });
});
