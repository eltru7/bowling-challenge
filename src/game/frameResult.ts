import { FrameResultType } from "../game/frameResultType";
import { ThrowResult } from "./throwResult";

// TODO remove .. import
// TODO interface not in a single file
export interface FrameResult {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
}
