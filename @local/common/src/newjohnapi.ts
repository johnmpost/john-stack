import { flow, pipe, Schema, Ef, O, A, E } from "./toolbox";
import type { AST } from "@effect/schema";
import { NetworkError, networkError } from "./errors";
import { Types } from "effect";

type Token = Schema.PropertySignature.Token;

type FieldsNoContext = {
  readonly [x: PropertyKey]:
    | Schema.Schema.AnyNoContext
    | Schema.PropertySignature<
        Token,
        any,
        PropertyKey,
        Token,
        any,
        boolean,
        never
      >
    | Schema.PropertySignature<
        Token,
        never,
        PropertyKey,
        Token,
        any,
        boolean,
        never
      >
    | Schema.PropertySignature<
        Token,
        any,
        PropertyKey,
        Token,
        never,
        boolean,
        never
      >
    | Schema.PropertySignature<
        Token,
        never,
        PropertyKey,
        Token,
        never,
        boolean,
        never
      >;
};

export type WebFunctionDef<
  Name extends string,
  Params extends Record<string, any>,
  Result,
  EncodedResult
> = {
  params: Schema.Schema<{ name: Name } & Params>;
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

export type WebFunction<
  Name extends string,
  Params extends Record<string, any>,
  Result,
  EncodedResult
> = {
  spec: WebFunctionDef<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Result;
};

export type Invoker = <
  Name extends string,
  Params extends Record<string, any>,
  Result,
  EncodedResult
>(
  webFunction: WebFunctionDef<Name, Params, Result, EncodedResult>
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

const defineWebFunctionParams = <
  Name extends string,
  Fields extends FieldsNoContext
>(
  name: Name,
  params: Fields
) => {
  const schema = Schema.Struct({ ...params, name: Schema.tag(name) });
  const schema_: Schema.Schema<typeof schema.Type, typeof schema.Encoded> =
    schema as any;
  return schema_;
};

type ExcludeName<T extends string> = T extends "name" ? never : T;

const encodeSync = <
  Name extends string,
  Params extends Record<string, any>,
  Result,
  EncodedResult
>(
  webFunction: WebFunctionDef<Name, Params, Result, EncodedResult>,
  params: Omit<typeof webFunction.params.Type, "name">
  // params: typeof webFunction.params.Type
) =>
  Schema.encodeSync(webFunction.params)({
    ...params,
    name: webFunction.params.Encoded.name as Name,
  });

const test = defineWebFunctionParams("MyFunc", { user: Schema.String });
Schema.encodeSync(test)({ user: "john", name: test.Encoded.name });

export const mkInvoke =
  (url: string) =>
  <
    Name extends string,
    Params extends Record<string, any>,
    Result,
    EncodedResult
  >(
    webFunction: WebFunctionDef<Name, Params, Result, EncodedResult>
  ) =>
  (params: Omit<typeof webFunction.params.Type, "name">) =>
    // (params: typeof webFunction.params.Type) =>
    pipe(
      { ...params, name: webFunction.params.Encoded.name },
      Schema.encodeSync(webFunction.params)
      // postJson(url),
      // Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionSpec.result)))
    );
