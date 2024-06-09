import { pipe, Schema, Ef, A, O } from "./toolbox";
import { CannotConnectToHost } from "./errors";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

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

type OperationDef<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> =
  | QueryDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>
  | MutationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>;

export type OperationImpl<Def> =
  Def extends OperationDef<
    any,
    infer Params,
    infer Success,
    any,
    infer Error,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer EncodedError
  >
    ? (params: Params) => Ef.Effect<Success, Error>
    : never;

export type Operation<
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
> = {
  def: OperationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>;
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
  (params: Params) =>
  (
    opts: Omit<
      UseMutationOptions<Success, Error | CannotConnectToHost>,
      "mutationFn"
    >,
  ) => {
    const mutation = pipe(
      { _tag: mutationDef._tag, params },
      Schema.encodeSync(Schema.parseJson(mutationDef.params)),
      postJson(url),
      Ef.map(
        Schema.decodeSync(
          Schema.parseJson(
            Schema.Either({
              left: mutationDef.error,
              right: mutationDef.success,
            }),
          ),
        ),
      ),
      Ef.flatten,
    );
    return useMutation({ mutationFn: () => Ef.runPromise(mutation), ...opts });
  };

export const mkOperation = <
  Name extends string,
  Params,
  Success,
  EncodedSuccess,
  Error,
  EncodedError,
>(
  def: OperationDef<Name, Params, Success, EncodedSuccess, Error, EncodedError>,
  impl: OperationImpl<typeof def>,
): Operation<Name, Params, Success, EncodedSuccess, Error, EncodedError> => ({
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

const executeOperation =
  (jsonBody: string) => (operation: Operation<any, any, any, any, any, any>) =>
    pipe(
      Schema.decodeSync(Schema.parseJson(operation.def.params))(jsonBody),
      operation.impl,
      Ef.either,
      Ef.map(
        Schema.encodeSync(
          Schema.parseJson(
            Schema.Either({
              left: operation.def.error,
              right: operation.def.success,
            }),
          ),
        ),
      ),
    );

export const mkRequestHandler =
  (operation: Operation<any, any, any, any, any, any>[]) =>
  (jsonBody: string) =>
    pipe(
      operation,
      A.findFirst<Operation<any, any, any, any, any, any>>(wf =>
        O.isSome(
          Schema.decodeOption(Schema.parseJson(wf.def.params))(jsonBody),
        ),
      ),
      O.getOrThrowWith(() => "Request body did not match any web function"),
      executeOperation(jsonBody),
    );
