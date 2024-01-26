import { flow, pipe } from "effect";
import * as O from "effect/Option";
import * as A from "effect/ReadonlyArray";
import * as Ef from "effect/Effect";
import * as S from "@effect/schema/Schema";
import { networkError, noMatchingActionError, parseError } from "./errors";

export type ActionSpec<P, P2, R, R2> = {
  params: S.Schema<never, P, P2>;
  result: S.Schema<never, R, R2>;
};

export type ActionHandler<T> = T extends ActionSpec<any, infer P, any, infer R>
  ? (params: P) => R
  : never;

export type Action<P, P2, R, R2> = {
  spec: ActionSpec<P, P2, R, R2>;
  handler: (params: P2) => R2;
};

const decodeOrParseError = <T, U>(schema: S.Schema<never, T, U>) =>
  flow(
    S.decodeEither(schema),
    Ef.mapError(() => parseError)
  );

const postAsJson =
  (route: string) =>
  <T>(body: T) =>
    Ef.tryPromise({
      try: () =>
        fetch(route, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      catch: () => networkError,
    });

const parseJsonBody = (response: Response) =>
  Ef.tryPromise({
    try: () => response.json(),
    catch: () => parseError,
  });

const post =
  (route: string) =>
  <T>(body: T) =>
  <U, V>(responseSchema: S.Schema<never, U, V>) =>
    pipe(
      postAsJson(route)(body),
      Ef.flatMap(parseJsonBody),
      Ef.flatMap(decodeOrParseError(responseSchema))
    );

export const mkInvoke =
  (route: string) =>
  <P, P2, R, R2>(action: ActionSpec<P, P2, R, R2>) =>
  (params: P2) =>
    post(route)(params)(action.result);

export const mkAction =
  <P, P2, R, R2>(spec: ActionSpec<P, P2, R, R2>) =>
  (handler: ActionHandler<typeof spec>): Action<P, P2, R, R2> => ({
    spec,
    handler,
  });

const parseParams =
  (requestBody: string) =>
  <P, P2, R, R2>(action: Action<P, P2, R, R2>) =>
    pipe(
      requestBody,
      S.decodeOption(S.parseJson()),
      O.flatMap(S.decodeUnknownOption(action.spec.params)),
      O.map((params) => [action, params] as const)
    );

export const mkRequestHandler =
  (actions: Action<any, any, any, any>[]) => (requestBody: string) =>
    pipe(
      actions,
      A.map(parseParams(requestBody)),
      A.getSomes,
      A.head,
      O.map(([action, params]) => action.handler(params)),
      O.getOrElse(() => noMatchingActionError)
    );
