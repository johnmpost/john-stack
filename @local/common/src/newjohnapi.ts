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

type AnyRecordWithoutName = {
  [x: string]: any;
  name?: never;
};
// type WithoutName<T> = {
//   [P in keyof T]: P extends "name" ? never | undefined : T[P];
// };
type DoesNotHaveName<T> = T extends AnyRecordWithoutName ? T : never;
const hasName: AnyRecordWithoutName = { name: "" };
const noName: AnyRecordWithoutName = { last: "" };
type HasName = DoesNotHaveName<{ name: string }>;
type NoName = DoesNotHaveName<{ age: string }>;

const testFunc = <T extends Record<string, any>>(x: DoesNotHaveName<T>) =>
  x.name;
const res = testFunc({ name: "" });

export type WebFunctionDef<
  Name extends string,
  Params extends Record<string, any>,
  Result,
  EncodedResult
> = {
  params: Schema.Schema<{ name: Name } & DoesNotHaveName<Params>>;
  result: Schema.Schema<Result, EncodedResult>;
};

const def: WebFunctionDef<"Def", { age: number }, string, string> = null as any;
const myname = def.params.Encoded.name;

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

const encodeSync =
  <
    Name extends string,
    Params extends Record<string, any>,
    Result,
    EncodedResult
  >(
    webFunction: WebFunctionDef<Name, Params, Result, EncodedResult>
  ) =>
  (
    params: Omit<typeof webFunction.params.Type, "name">
    // params: typeof webFunction.params.Type
  ) => {
    const name: Name = webFunction.params.Encoded.name;
    const props: WithoutName<Params> = params;
    const toEncode: { name: Name } & Params = { name, ...props };
    const encoded = Schema.encodeSync(webFunction.params)(toEncode);
    return encoded;
  };

const invalidObject: AnyRecordWithoutName = {
  name: "John",
  age: 30,
};

const test = defineWebFunctionParams("MyFunc", { user: Schema.String });
Schema.encodeSync(test)({ user: "john", name: test.Encoded.name });
const test2 = encodeSync({ params: test, result: Schema.String })({
  user: "john",
});

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
