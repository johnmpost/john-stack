import { pipe } from "effect";
import { ParamsParseError, ResultParseError, paramsParseError } from "./errors";
import { O, S, A, E } from "./exports";

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

const parseParams =
  (requestBody: string) =>
  <P, R>(action: Action<P, R>) =>
    O.Do.pipe(
      O.bind("params", () =>
        S.parseOption(S.parseJson(action.spec.params))(requestBody)
      ),
      O.map(({ params }) => [action, params] as const)
    );

export const endpoint =
  (actions: Action<any, any>[]) => (requestBody: string) =>
    pipe(
      actions,
      A.map(parseParams(requestBody)),
      A.getSomes,
      A.head,
      O.map(([action, params]) => action.handler(params)),
      O.getOrElse(() => paramsParseError)
    );
