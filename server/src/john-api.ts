import { flow, pipe } from "effect";
import { parseError, networkError, invalidActionError } from "./errors";
import { O, A, Ef, S } from "./exports";

export type ActionSpec<P, R> = { params: S.Schema<P>; result: S.Schema<R> };

export type ActionHandler<T> = T extends ActionSpec<infer P, infer R>
  ? (param: P) => R
  : never;

export type Action<P, R> = {
  spec: ActionSpec<P, R>;
  handler: (params: P) => R;
};

const parseSimple = <T>(schema: S.Schema<T>) => flow(S.parse(schema));

const post =
  (route: string) =>
  <T>(body: T) =>
  <U>(responseSchema: S.Schema<U>) =>
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
  <P, R>(action: ActionSpec<P, R>) =>
  (params: P) =>
    pipe(post(route)(params)(action.result));

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
      O.getOrElse(() => invalidActionError)
    );
