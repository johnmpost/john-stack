import { pipe, Schema, Ef, id, A, O } from "./toolbox";
import { NetworkError, networkError } from "./errors";

export type WebFunctionDef<
  Name extends string,
  Params,
  Result,
  EncodedResult,
> = {
  params: Schema.Struct<{
    _tag: Schema.Literal<[Name]>;
    params: Schema.Schema<Params>;
  }>;
  result: Schema.Schema<Result, EncodedResult>;
};

export type WebFunctionImpl<Def> =
  Def extends WebFunctionDef<any, infer Params, infer Result, any>
    ? (params: Params) => Ef.Effect<Result>
    : never;

export type WebFunction<Name extends string, Params, Result, EncodedResult> = {
  def: WebFunctionDef<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Ef.Effect<Result>;
};

export type Invoker = <Name extends string, Params, Result, EncodedResult>(
  webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>,
) => (params: Params) => Ef.Effect<Result, NetworkError>;

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
    }),
  );

export const mkInvoke =
  (url: string): Invoker =>
  <Name extends string, Params, Result, EncodedResult>(
    webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>,
  ) =>
  (params: Params) =>
    pipe(
      { _tag: webFunctionDef.params.Type._tag, params },
      Schema.encodeSync(Schema.parseJson(webFunctionDef.params)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionDef.result))),
    );

export const mkInvokeWithOnError =
  (url: string) =>
  (onNetworkError: () => void): Invoker =>
  <Name extends string, Params, Result, EncodedResult>(
    webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>,
  ) =>
  (params: Params) =>
    pipe(
      { _tag: webFunctionDef.params.Type._tag, params },
      Schema.encodeSync(Schema.parseJson(webFunctionDef.params)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionDef.result))),
      Ef.match({
        onFailure: () => {
          onNetworkError();
          throw "networkError";
        },
        onSuccess: id,
      }),
    );

export const mkWebFunction = <
  Name extends string,
  Params,
  Result,
  EncodedResult,
>(
  def: WebFunctionDef<Name, Params, Result, EncodedResult>,
  impl: WebFunctionImpl<typeof def>,
): WebFunction<Name, Params, Result, EncodedResult> => ({ def, impl });

export const mkWebFunctionDef = <
  Name extends string,
  Params,
  Result,
  EncodedResult,
>(
  name: Name,
  params: Schema.Schema<Params>,
  result: Schema.Schema<Result, EncodedResult>,
): WebFunctionDef<Name, Params, Result, EncodedResult> => ({
  params: Schema.Struct({ _tag: Schema.Literal(name), params }),
  result,
});

const executeWebFunction =
  (jsonBody: string) => (webFunction: WebFunction<any, any, any, any>) =>
    pipe(
      Schema.decode(Schema.parseJson(webFunction.def.params))(jsonBody),
      Ef.orDieWith(() => "Failed to decode params"),
      webFunction.impl,
      Schema.encode(Schema.parseJson(webFunction.def.result)),
      Ef.orDieWith(() => "Failed to encode result"),
    );

export const mkRequestHandler =
  (webFunctions: WebFunction<any, any, any, any>[]) => (jsonBody: string) =>
    pipe(
      webFunctions,
      A.findFirst<WebFunction<any, any, any, any>>(wf =>
        Schema.is(Schema.parseJson(wf.def.params))(jsonBody),
      ),
      O.getOrThrowWith(() => "Request body did not match any web function"),
      executeWebFunction(jsonBody),
    );
