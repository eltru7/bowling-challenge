import { FrameResultType } from "../game/frameResultType";
import { ThrowResult } from "./throwResult";

export interface FrameResult {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
}
