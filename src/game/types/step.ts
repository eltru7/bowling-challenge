export enum StepType {
  NEXT_FRAME = "NEXT_FRAME",
  NEXT_THROW = "NEXT_THROW",
  END_GAME = "END_GAME",
}

export type Step = {
  type: StepType;
  nbAvailablePinsToKnock: number;
};
