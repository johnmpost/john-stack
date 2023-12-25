import { ResultParseError, UserDoesNotExistError } from "./errors";
import { E, S } from "./exports";

export const unit = {};
export const Unit = S.struct({});
export type Unit = S.Schema.To<typeof Unit>;

export type Action<P, R> = { params: S.Schema<P>; result: S.Schema<R> };

export declare const invoke: <P, R>(
  action: Action<P, R>
) => (params: Omit<P, "kind">) => E.Either<ResultParseError, R>;
