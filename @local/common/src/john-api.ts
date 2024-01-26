import { flow, pipe } from "effect";
import * as O from "effect/Option";
import * as A from "effect/ReadonlyArray";
import * as Ef from "effect/Effect";
import * as S from "@effect/schema/Schema";
import { networkError, noMatchingActionError, parseError } from "./errors";

export type ActionSpec<P, R> = {
  params: S.Schema<never, P>;
  result: S.Schema<never, R>;
};

export type ActionHandler<T> = T extends ActionSpec<infer P, infer R>
  ? (params: P) => R
  : never;

export type Action<P, R> = {
  spec: ActionSpec<P, R>;
  handler: (params: P) => R;
};

const decodeOrParseError = <T>(schema: S.Schema<never, T>) =>
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
  <V>(responseSchema: S.Schema<never, V>) =>
    pipe(
      postAsJson(route)(body),
      Ef.flatMap(parseJsonBody),
      Ef.flatMap(decodeOrParseError(responseSchema))
    );

export const mkInvoke =
  (route: string) =>
  <P, R>(action: ActionSpec<P, R>) =>
  (params: P) =>
    post(route)(params)(action.result);

export const mkAction =
  <P, R>(spec: ActionSpec<P, R>) =>
  (handler: ActionHandler<typeof spec>): Action<P, R> => ({
    spec,
    handler,
  });

const parseParams =
  (requestBody: string) =>
  <P, R>(action: Action<P, R>) =>
    pipe(
      requestBody,
      S.decodeOption(S.parseJson()),
      S.decodeUnknownOption(action.spec.params),
      O.map((params) => [action, params] as const)
    );

export const mkRequestHandler =
  (actions: Action<any, any>[]) => (requestBody: string) =>
    pipe(
      actions,
      A.map(parseParams(requestBody)),
      A.getSomes,
      A.head,
      O.map(([action, params]) => action.handler(params)),
      O.getOrElse(() => noMatchingActionError)
    );
