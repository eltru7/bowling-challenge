import ThrowResult from "./throwResult";
import { FrameResultType } from "./frameResultType";

export type FrameResult = {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
};
