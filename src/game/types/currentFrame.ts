import { FrameResultType } from "./frameResultType";
import { ThrowResult } from "./throwResult";

export type CurrentFrame = {
  frameNumber: number;
  throwNumber: number;
  resultType: FrameResultType;
  throwsResult: ThrowResult[];
};
