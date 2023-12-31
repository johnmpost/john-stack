import { flow, pipe } from "effect";
import { parseError, networkError, invalidActionError } from "./errors";
import { O, A, Ef, S } from "./exports";

export type ActionSpec<P, P2, R, R2> = {
  params: S.Schema<P, P2>;
  result: S.Schema<R, R2>;
};

export type ActionHandler<T> = T extends ActionSpec<
  any,
  infer P2,
  any,
  infer R2
>
  ? (param: P2) => R2
  : never;

export type Action<P, P2, R, R2> = {
  spec: ActionSpec<P, P2, R, R2>;
  handler: (params: P2) => R2;
};

const parseSimple = <T, U>(schema: S.Schema<T, U>) =>
  flow(
    S.parseOption(schema),
    Ef.mapError(() => parseError)
  );

const post =
  (route: string) =>
  <T>(body: T) =>
  <U, V>(responseSchema: S.Schema<U, V>) =>
    pipe(
      Ef.tryPromise({
        try: () =>
          fetch(route, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
        catch: () => networkError,
      }),
      Ef.flatMap((response) =>
        Ef.tryPromise({
          try: () => response.json(),
          catch: () => parseError,
        })
      ),
      Ef.flatMap(parseSimple(responseSchema))
    );

export const mkInvoke =
  (route: string) =>
  <P, P2, R, R2>(action: ActionSpec<P, P2, R, R2>) =>
  (params: P) =>
    pipe(post(route)(params)(action.result));

export const handle =
  <P, P2, R, R2>(spec: ActionSpec<P, P2, R, R2>) =>
  (handler: ActionHandler<typeof spec>): Action<P, P2, R, R2> => ({
    spec,
    handler,
  });

const parseParams =
  (requestBody: string) =>
  <P, P2, R, R2>(action: Action<P, P2, R, R2>) =>
    O.Do.pipe(
      O.bind("params", () =>
        S.parseOption(S.parseJson(action.spec.params))(requestBody)
      ),
      O.map(({ params }) => [action, params] as const)
    );

export const endpoint =
  (actions: Action<any, any, any, any>[]) => (requestBody: string) =>
    pipe(
      actions,
      A.map(parseParams(requestBody)),
      A.getSomes,
      A.head,
      O.map(([action, params]) => action.handler(params)),
      O.getOrElse(() => invalidActionError)
    );
