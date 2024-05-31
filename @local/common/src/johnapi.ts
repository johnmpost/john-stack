import { flow, pipe, Schema, Ef, O, A } from "./toolbox";
import { NetworkError, networkError } from "./errors";

export type WebFunctionSpec<Param, EncodedParam, Result, EncodedResult> = {
  param: Schema.Schema<Param, EncodedParam>;
  result: Schema.Schema<Result, EncodedResult>;
};

export type WebFunctionImpl<T> = T extends WebFunctionSpec<
  infer Param,
  never, // change to unknown?
  infer Result,
  never
>
  ? (param: Param) => Result
  : never;

export type WebFunction<Param, EncodedParam, Result, EncodedResult> = {
  spec: WebFunctionSpec<Param, EncodedParam, Result, EncodedResult>;
  impl: (param: Param) => Result;
};

export type Invoker = <Param, EncodedParam, Result, EncodedResult>(
  webFunction: WebFunctionSpec<Param, EncodedParam, Result, EncodedResult>
) => (param: Param) => Ef.Effect<Result, NetworkError>;

const postJson = (url: string) => (jsonBody: string) =>
  pipe(
    Ef.tryPromise({
      try: () =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonBody,
        }).then(x => x.text()),
      catch: () => networkError,
    })
  );

export const mkInvoke =
  (url: string): Invoker =>
  <Param, EncodedParam, Result, EncodedResult>(
    webFunction: WebFunctionSpec<Param, EncodedParam, Result, EncodedResult>
  ) =>
  (param: Param) =>
    pipe(
      param,
      Schema.encodeSync(Schema.parseJson(webFunction.param)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(webFunction.result)))
    );

export const mkWebFunction =
  <Param, EncodedParam, Result, EncodedResult>(
    spec: WebFunctionSpec<Param, EncodedParam, Result, EncodedResult>
  ) =>
  (
    impl: WebFunctionImpl<typeof spec>
  ): WebFunction<Param, EncodedParam, Result, EncodedResult> => ({
    spec,
    impl,
  });

const parseParams =
  (requestBody: string) =>
  <P, P2, R, R2>(action: Action<P, P2, R, R2>) =>
    pipe(
      requestBody,
      S.decodeOption(S.parseJson()),
      O.flatMap(S.decodeUnknownOption(action.spec.params)),
      O.map(params => [action, params] as const)
    );

export const mkRequestHandler =
  (webFunctions: WebFunction<unknown, unknown, unknown, unknown>[]) =>
  (requestBodyJson: string) =>
    pipe(
      actions,
      A.map(parseParams(requestBody)),
      A.getSomes,
      A.head,
      O.map(([action, params]) => action.handler(params))
    );
