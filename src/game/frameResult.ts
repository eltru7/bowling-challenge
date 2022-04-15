import { FrameResultType } from "../game/frameResultType";

// TODO remove .. import
// TODO interface not in a single file
export interface FrameResult {
  frameNumber: number;
  resultType: FrameResultType;
  throwResults: ThrowResult[];
}
