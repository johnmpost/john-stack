import { ResultParseError, UserDoesNotExistError } from "./errors";
import { E, S } from "./exports";

export const unit = {};
export const Unit = S.struct({});
export type Unit = S.Schema.To<typeof Unit>;

export type ActionSpec<P, R> = { params: S.Schema<P>; result: S.Schema<R> };

export type ActionHandler<
  P extends { readonly [S.TypeId]: { readonly To: (..._: any) => any } },
  R extends { readonly [S.TypeId]: { readonly To: (..._: any) => any } }
> = (x: S.Schema.To<P>) => S.Schema.To<R>;

export type Action<
  P extends { readonly [S.TypeId]: { readonly To: (..._: any) => any } },
  R extends { readonly [S.TypeId]: { readonly To: (..._: any) => any } }
> = [action: ActionSpec<P, R>, handler: ActionHandler<P, R>];

export declare const invoke: <P, R>(
  action: ActionSpec<P, R>
) => (params: Omit<P, "kind">) => E.Either<ResultParseError, R>;
