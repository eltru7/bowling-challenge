import { FrameResultType } from "./frameResultType";
import { ThrowResult } from "./throwResult";

export interface CurrentFrame {
  frameNumber: number;
  throwNumber: number;
  resultType: FrameResultType;
  throwsResult: ThrowResult[];
}

//TODO better name than ResultType.REGULAR

// TODO est-ce que la frame  pourrait etre une classe qui sait si elle est strike spare etc
