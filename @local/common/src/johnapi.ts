import { pipe, Schema, Ef, A, O } from "./toolbox";
import { CannotConnectToHost } from "./errors";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryKey = readonly unknown[];

type DefinitionParams<Name extends string, Params> = Schema.Struct<{
  _tag: Schema.Literal<[Name]>;
  params: Schema.Schema<Params>;
}>;

export type QueryDef<Name extends string, Params, Result, EncodedResult> = {
  _tag: Name;
  params: DefinitionParams<Name, Params>;
  result: Schema.Schema<Result, EncodedResult>;
  mkQueryKey: (params: Params) => QueryKey;
};

export type MutationDef<Name extends string, Params, Result, EncodedResult> = {
  _tag: Name;
  params: DefinitionParams<Name, Params>;
  result: Schema.Schema<Result, EncodedResult>;
};

export type Impl<Def> =
  Def extends QueryDef<any, infer Params, infer Result, any>
    ? (params: Params) => Ef.Effect<Result>
    : Def extends MutationDef<any, infer Params, infer Result, any>
      ? (params: Params) => Ef.Effect<Result>
      : never;

export type WebFunction<Name extends string, Params, Result, EncodedResult> = {
  def:
    | QueryDef<Name, Params, Result, EncodedResult>
    | MutationDef<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Ef.Effect<Result>;
};

// export type InvokeMutation = <
//   Name extends string,
//   Params,
//   Result,
//   EncodedResult,
// >(
//   mutationDef: MutationDef<Name, Params, Result, EncodedResult>,
// ) => (params: Params) => Ef.Effect<Result, NetworkError>;

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
  <Name extends string, Params, Result, EncodedResult>(
    queryDef: QueryDef<Name, Params, Result, EncodedResult>,
  ) =>
  (params: Params) =>
  (
    opts: Omit<
      UseQueryOptions<Result, CannotConnectToHost>,
      "queryFn" | "queryKey"
    >,
  ) => {
    const query = pipe(
      { _tag: queryDef._tag, params },
      Schema.encodeSync(Schema.parseJson(queryDef.params)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(queryDef.result))),
    );
    const queryKey = queryDef.mkQueryKey(params);
    return useQuery({ queryKey, queryFn: () => Ef.runPromise(query), ...opts });
  };

export const mkWebFunction = <
  Name extends string,
  Params,
  Result,
  EncodedResult,
>(
  def:
    | QueryDef<Name, Params, Result, EncodedResult>
    | MutationDef<Name, Params, Result, EncodedResult>,
  impl: Impl<typeof def>,
): WebFunction<Name, Params, Result, EncodedResult> => ({ def, impl });

export const mkQueryDef = <Name extends string, Params, Result, EncodedResult>(
  name: Name,
  params: Schema.Schema<Params>,
  result: Schema.Schema<Result, EncodedResult>,
  mkQueryKey: (params: Params) => QueryKey,
): QueryDef<Name, Params, Result, EncodedResult> => ({
  _tag: name,
  params: Schema.Struct({ _tag: Schema.Literal(name), params }),
  result,
  mkQueryKey,
});

const executeWebFunction =
  (jsonBody: string) => (webFunction: WebFunction<any, any, any, any>) =>
    pipe(
      Schema.decodeSync(Schema.parseJson(webFunction.def.params))(jsonBody),
      webFunction.impl,
      Ef.map(Schema.encodeSync(Schema.parseJson(webFunction.def.result))),
    );

export const mkRequestHandler =
  (webFunctions: WebFunction<any, any, any, any>[]) => (jsonBody: string) =>
    pipe(
      webFunctions,
      A.findFirst<WebFunction<any, any, any, any>>(wf =>
        O.isSome(
          Schema.decodeOption(Schema.parseJson(wf.def.params))(jsonBody),
        ),
      ),
      O.getOrThrowWith(() => "Request body did not match any web function"),
      executeWebFunction(jsonBody),
    );
