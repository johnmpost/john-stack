import { pipe, Schema, Ef, A, O } from "./toolbox";
import { CannotConnectToHost } from "./errors";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryKey = readonly unknown[];

type DefinitionParams<Name extends string, Params> = Schema.Struct<{
  _tag: Schema.Literal<[Name]>;
  params: Schema.Schema<Params>;
}>;

export type QueryDef<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> = {
  _tag: Name;
  params: DefinitionParams<Name, Params>;
  success: Schema.Schema<Success, EncodedSuccess>;
  error: Schema.Schema<Error, EncodedError>;
  mkQueryKey: (params: Params) => QueryKey;
};

export type MutationDef<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> = {
  _tag: Name;
  params: DefinitionParams<Name, Params>;
  success: Schema.Schema<Success, EncodedSuccess>;
  error: Schema.Schema<Error, EncodedError>;
};

export type Impl<Def> =
  Def extends QueryDef<
    any,
    infer Params,
    infer Success,
    any,
    infer Error,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer EncodedError
  >
    ? (params: Params) => Ef.Effect<Success, Error>
    : Def extends MutationDef<
          any,
          infer Params,
          infer Success,
          any,
          infer Error,
          any
        >
      ? (params: Params) => Ef.Effect<Success, Error>
      : never;

export type WebFunction<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> = {
  def:
    | QueryDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>
    | MutationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>;
  impl: (params: Params) => Ef.Effect<Success, Error>;
};

const postJson = (url: string) => (jsonBody: string) =>
  pipe(
    Ef.tryPromise({
      try: () =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonBody,
        }).then(x => x.text()),
      catch: () => CannotConnectToHost.make({}),
    }),
  );

export const mkUseQuery =
  (url: string) =>
  <Name extends string, Params, Success, EncodedSuccess, Error, EncodedError>(
    queryDef: QueryDef<
      Name,
      Params,
      Success,
      EncodedSuccess,
      Error,
      EncodedError
    >,
  ) =>
  (params: Params) =>
  (
    opts: Omit<
      UseQueryOptions<Success, Error | CannotConnectToHost>,
      "queryFn" | "queryKey"
    >,
  ) => {
    const query = pipe(
      { _tag: queryDef._tag, params },
      Schema.encodeSync(Schema.parseJson(queryDef.params)),
      postJson(url),
      Ef.map(
        Schema.decodeSync(
          Schema.parseJson(
            Schema.Either({ left: queryDef.error, right: queryDef.success }),
          ),
        ),
      ),
      Ef.flatten,
    );
    const queryKey = queryDef.mkQueryKey(params);
    return useQuery({ queryKey, queryFn: () => Ef.runPromise(query), ...opts });
  };

export const mkWebFunction = <
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
>(
  def:
    | QueryDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>
    | MutationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>,
  impl: Impl<typeof def>,
): WebFunction<Name, Params, Success, EncodedSuccess, Error, EncodedError> => ({
  def,
  impl,
});

export const mkQueryDef = <
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
>(
  name: Name,
  params: Schema.Schema<Params>,
  mkQueryKey: (params: Params) => QueryKey,
  success: Schema.Schema<Success, EncodedSuccess>,
  error: Schema.Schema<Error, EncodedError>,
): QueryDef<Name, Params, Success, EncodedSuccess, Error, EncodedError> => ({
  _tag: name,
  params: Schema.Struct({ _tag: Schema.Literal(name), params }),
  success,
  error,
  mkQueryKey,
});

const executeWebFunction =
  (jsonBody: string) =>
  (webFunction: WebFunction<any, any, any, any, any, any>) =>
    pipe(
      Schema.decodeSync(Schema.parseJson(webFunction.def.params))(jsonBody),
      webFunction.impl,
      Ef.either,
      Ef.map(
        Schema.encodeSync(
          Schema.parseJson(
            Schema.Either({
              left: webFunction.def.error,
              right: webFunction.def.success,
            }),
          ),
        ),
      ),
    );

export const mkRequestHandler =
  (webFunctions: WebFunction<any, any, any, any, any, any>[]) =>
  (jsonBody: string) =>
    pipe(
      webFunctions,
      A.findFirst<WebFunction<any, any, any, any, any, any>>(wf =>
        O.isSome(
          Schema.decodeOption(Schema.parseJson(wf.def.params))(jsonBody),
        ),
      ),
      O.getOrThrowWith(() => "Request body did not match any web function"),
      executeWebFunction(jsonBody),
    );
