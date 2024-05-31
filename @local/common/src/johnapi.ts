import { flow, pipe, Schema, Ef, O, A, E } from "./toolbox";
import { NetworkError, networkError } from "./errors";
import { LiteralValue } from "@effect/schema/AST";

import type * as Types from "effect/Types";
import { Struct, tag, TypeLiteral } from "@effect/schema/Schema";

export type WebFunctionSpec<
  Name extends LiteralValue,
  Params extends Schema.Struct.Fields,
  Result,
  EncodedResult
> = {
  params: Schema.TaggedStruct<Name, Params>;
  result: Schema.Schema<Result, EncodedResult>;
};

export type WebFunctionImpl<T> = T extends WebFunctionSpec<
  any,
  infer Params,
  infer Result,
  any
>
  ? (params: Params) => Result
  : never;

export type WebFunction<
  Name extends LiteralValue,
  Params extends Schema.Struct.Fields,
  Result,
  EncodedResult
> = {
  spec: WebFunctionSpec<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Result;
};

export type Invoker = <
  Name extends LiteralValue,
  Params extends Schema.Struct.Fields,
  Result,
  EncodedResult
>(
  webFunction: WebFunctionSpec<Name, Params, Result, EncodedResult>
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

const User = Schema.TaggedStruct("User", {
  name: Schema.String,
  age: Schema.Number,
});
type User = typeof User.Type;

const userInstance = User.make({ name: "John", age: 44 });

// type Fields<T> = T extends Schema.TaggedStruct<any, infer F>
//   ? Schema.Schema.Type<F>
//   : never;

const make =
  <Name extends LiteralValue, Fields extends Schema.Struct.Fields>(
    taggedStruct: Schema.TaggedStruct<Name, Fields>
  ) =>
  // (props: Types.Simplify<TypeLiteral.Constructor<Fields, Records>>) =>
  // (fields: Omit<typeof taggedStruct.Type, "_tag">) =>
  (fields: Types.Simplify<Struct.Constructor<{ _tag: tag<Name> } & Fields>>) =>
    taggedStruct.make(fields);

const fields: Omit<typeof User.Type, "_tag"> = { name: "", age: 4 };
User.make(fields);

const makeTest = make(User)({ name: "", age: 4 });

export const mkInvoke =
  (url: string): Invoker =>
  <
    Name extends LiteralValue,
    Params extends Schema.Struct.Fields,
    Result,
    EncodedResult
  >(
    webFunctionSpec: WebFunctionSpec<Name, Params, Result, EncodedResult>
  ) =>
  (params: Params) =>
    pipe(
      webFunctionSpec.params.make(params),
      Schema.encodeSync(Schema.parseJson(webFunctionSpec.params)),
      postJson(url),
      Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionSpec.result)))
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

const myStruct = Schema.TaggedStruct("MyFunction", { name: Schema.String });
const test = mkWebFunction({
  params: myStruct,
  result: Schema.Either({ left: Schema.Number, right: Schema.String }),
})(param => E.left(5));

const tested = mkInvoke("")(test.spec)(myStruct.make({ name: "" }));

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
