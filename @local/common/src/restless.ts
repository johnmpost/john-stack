import { pipe, Schema, Ef, A, O, flow } from "./toolbox";
import { CannotConnectToHost } from "./errors";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

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
  // define query invalidations here
};

type ActionDef<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> =
  | QueryDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>
  | MutationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>;

export type ActionImpl<Def, Requirements> =
  Def extends ActionDef<
    any,
    infer Params,
    infer Success,
    any,
    infer Error,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer EncodedError
  >
    ? (params: Params) => Ef.Effect<Success, Error, Requirements>
    : never;

export type Action<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
  Requirements,
> = {
  def: ActionDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>;
  impl: (params: Params) => Ef.Effect<Success, Error, Requirements>;
};

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

export const mkMutationDef = <
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
>(
  name: Name,
  params: Schema.Schema<Params>,
  success: Schema.Schema<Success, EncodedSuccess>,
  error: Schema.Schema<Error, EncodedError>,
): MutationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError> => ({
  _tag: name,
  params: Schema.Struct({ _tag: Schema.Literal(name), params }),
  success,
  error,
});

export const mkAction = <
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
  Requirements,
>(
  def: ActionDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>,
  impl: ActionImpl<typeof def, Requirements>,
): Action<
  Name,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
  Requirements
> => ({
  def,
  impl,
});

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
    > = {},
  ) => {
    const query = pipe(
      { _tag: queryDef._tag, params },
      Schema.encodeSync(Schema.parseJson(queryDef.params)),
      postJson(url),
      Ef.flatMap(
        Schema.decodeSync(
          Schema.parseJson(
            Schema.Either({ left: queryDef.error, right: queryDef.success }),
          ),
        ),
      ),
    );
    const queryKey = queryDef.mkQueryKey(params);
    return useQuery({ queryKey, queryFn: () => Ef.runPromise(query), ...opts });
  };

export const mkUseMutation =
  (url: string) =>
  <Name extends string, Params, Success, EncodedSuccess, Error, EncodedError>(
    mutationDef: MutationDef<
      Name,
      Params,
      Success,
      EncodedSuccess,
      Error,
      EncodedError
    >,
  ) =>
  (
    opts: Omit<
      UseMutationOptions<Success, Error | CannotConnectToHost, Params>,
      "mutationFn"
    > = {},
  ) => {
    const mutation = flow(
      (params: Params) => ({ _tag: mutationDef._tag, params }),
      Schema.encodeSync(Schema.parseJson(mutationDef.params)),
      postJson(url),
      Ef.flatMap(
        Schema.decodeSync(
          Schema.parseJson(
            Schema.Either({
              left: mutationDef.error,
              right: mutationDef.success,
            }),
          ),
        ),
      ),
    );
    return useMutation({ mutationFn: flow(mutation, Ef.runPromise), ...opts });
  };

const executeAction =
  (jsonBody: string) =>
  <R>(action: Action<any, any, any, any, any, any, R>) =>
    pipe(
      Schema.decodeSync(Schema.parseJson(action.def.params))(jsonBody),
      body => body.params,
      action.impl,
      Ef.either,
      Ef.map(
        Schema.encodeSync(
          Schema.parseJson(
            Schema.Either({
              left: action.def.error,
              right: action.def.success,
            }),
          ),
        ),
      ),
    );

export const mkRequestHandler =
  <R>(actions: Action<any, any, any, any, any, any, R>[]) =>
  (jsonBody: string) =>
    pipe(
      actions,
      A.findFirst<Action<any, any, any, any, any, any, R>>(action =>
        O.isSome(
          Schema.decodeOption(Schema.parseJson(action.def.params))(jsonBody),
        ),
      ),
      O.getOrThrowWith(() => "Request body did not match any web function"),
      executeAction(jsonBody),
    );
