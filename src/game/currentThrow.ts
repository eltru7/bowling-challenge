import { FrameResultType } from "./frameResultType";

export interface CurrentThrow {
  throwNumber: number;
  frameNumber: number;
  resultType: FrameResultType;
}
