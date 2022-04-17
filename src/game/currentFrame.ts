import { FrameResultType } from "./frameResultType";
import { ThrowResult } from "./throwResult";

export interface CurrentFrame {
  frameNumber: number;
  throwNumber: number;
  resultType: FrameResultType;
  throwsResult: ThrowResult[];
}
