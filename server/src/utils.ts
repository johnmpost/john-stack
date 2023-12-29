import { ParamsParseError, ResultParseError } from "./errors";
import { E, S } from "./exports";

export const unit = {};
export const Unit = S.struct({});
export type Unit = S.Schema.To<typeof Unit>;

export type ActionSpec<P, R> = { params: S.Schema<P>; result: S.Schema<R> };

export type ActionHandler<T> = T extends ActionSpec<infer P, infer R>
  ? (param: P) => R
  : never;

export type Action<P, R> = {
  spec: ActionSpec<P, R>;
  handler: (params: P) => R;
};

export declare const invoke: <P, R>(
  action: ActionSpec<P, R>
) => (
  params: Omit<P, "kind">
) => E.Either<ResultParseError | ParamsParseError, R>;

export const handle =
  <P, R>(spec: ActionSpec<P, R>) =>
  (handler: ActionHandler<typeof spec>): Action<P, R> => ({ spec, handler });
