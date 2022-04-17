import { ThrowResult } from "./throwResult";

export enum FrameResultType {
  STRIKE = "STRIKE",
  SPARE = "SPARE",
  OPEN = "OPEN",
}

export interface FrameResult {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
}
