import type * as Channel from "../Channel.js";
import type { LazyArg } from "../Function.js";
export type Primitive = BracketOut | Bridge | ConcatAll | Emit | Ensuring | Fail | Fold | FromEffect | PipeTo | Provide | Read | Succeed | SucceedNow | Suspend;
export declare const sync: <OutDone>(evaluate: LazyArg<OutDone>) => Channel.Channel<never, unknown, unknown, unknown, never, never, OutDone>;
//# sourceMappingURL=core-stream.d.ts.map