import { ThrowResult } from "./throwResult";

export type FrameResult = {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
};

export enum FrameResultType {
  STRIKE = "STRIKE",
  SPARE = "SPARE",
  OPEN = "OPEN",
}
