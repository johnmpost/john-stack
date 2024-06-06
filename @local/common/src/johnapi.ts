import { pipe, Schema, Ef, E, id } from "./toolbox";
import { NetworkError, networkError } from "./errors";

export type WebFunctionDef<
  Name extends string,
  Params,
  Result,
  EncodedResult
> = {
  params: Schema.Struct<{
    _tag: Schema.Literal<[Name]>;
    params: Schema.Schema<Params>;
  }>;
  result: Schema.Schema<Result, EncodedResult>;
};

export type WebFunctionImpl<Def> = Def extends WebFunctionDef<
  any,
  infer Params,
  infer Result,
  any
>
  ? (params: Params) => Result
  : never;

export type WebFunction<Name extends string, Params, Result, EncodedResult> = {
  def: WebFunctionDef<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Result;
};

export type Invoker = <Name extends string, Params, Result, EncodedResult>(
  webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>
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
    })
  );

export const mkInvoke =
  (url: string): Invoker =>
  <Name extends string, Params, Result, EncodedResult>(
    webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>
  ) =>
  (params: Params) =>
    pipe(
      { _tag: webFunctionDef.params.Type._tag, params },
      Schema.encodeSync(Schema.parseJson(webFunctionDef.params)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionDef.result)))
    );

// IN PROGRESS
export const withOnError =
  <Name extends string, Params, Result, EncodedResult>(invoke: Invoker) =>
  (onNetworkError: () => void) =>
  (webFunctionDef: WebFunctionDef<Name, Params, Result, EncodedResult>) =>
  (params: Params) =>
    pipe(
      invoke(webFunctionDef)(params),
      Ef.match({
        onFailure: () => {
          onNetworkError();
          throw "networkError";
        },
        onSuccess: id,
      }),
      Ef.runSync
    );

export const mkWebFunction =
  <Name extends string, Params, Result, EncodedResult>(
    def: WebFunctionDef<Name, Params, Result, EncodedResult>
  ) =>
  (
    impl: WebFunctionImpl<typeof def>
  ): WebFunction<Name, Params, Result, EncodedResult> => ({ def, impl });

export const mkWebFunctionDef = <
  Name extends string,
  Params,
  Result,
  EncodedResult
>(
  name: Name,
  params: Schema.Schema<Params>,
  result: Schema.Schema<Result, EncodedResult>
): WebFunctionDef<Name, Params, Result, EncodedResult> => ({
  params: Schema.Struct({ _tag: Schema.Literal(name), params }),
  result,
});

// test
const MyWebFunction = mkWebFunctionDef(
  "MyWebFunction",
  Schema.Struct({ hello: Schema.String }),
  Schema.Either({ left: Schema.Number, right: Schema.String })
);

const myWebFunction: WebFunctionImpl<typeof MyWebFunction> = ({ hello }) =>
  E.right("not implemented");

const wf = mkWebFunction(MyWebFunction)(myWebFunction);

const justEffect = mkInvoke("")(MyWebFunction)({ hello: "john" });
// one version just returns an Effect
// one version is curried with an onError function, so it just returns the value in the Effect or throws and runs onError
// one version accepts onError and onSuccess at the end
