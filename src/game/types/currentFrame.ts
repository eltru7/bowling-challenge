import { FrameResultType } from "./frameResult";
import { ThrowResult } from "./throwResult";

export interface CurrentFrame {
  frameNumber: number;
  throwNumber: number;
  resultType: FrameResultType;
  throwsResult: ThrowResult[];
}
