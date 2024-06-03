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

const make =
  <Name extends LiteralValue, Fields extends Schema.Struct.Fields>(
    taggedStruct: Schema.TaggedStruct<Name, Fields>
  ) =>
  (fields: Types.Simplify<Struct.Constructor<Fields>>) =>
    taggedStruct.make(fields);

const invoker =
  <Name extends LiteralValue, Fields extends Schema.Struct.Fields>(
    taggedStruct: Schema.TaggedStruct<Name, Fields>
  ) =>
  (fields: Types.Simplify<Struct.Constructor<Fields>>) => {
    const value = taggedStruct.make(fields);
    const encoded = Schema.encodeSync(taggedStruct);
  };

const mkTaggedStruct = <
  Name extends LiteralValue,
  // Fields extends Schema.Struct.Fields
  Fields extends {
    readonly [x: string]: Schema.Schema.AnyNoContext;
  }
>(
  name: Name,
  // fields: {
  //   readonly [x: string]: Schema.Schema.AnyNoContext;
  // }
  fields: Fields
) => {
  const mySt = Schema.TaggedStruct(name, fields);
  // const test = Schema.Struct<{ [x: string]: Schema.Schema.AnyNoContext }>({
  //   email: Schema.String,
  //   test: Schema.Number,
  // });
  // type Test = Struct.Context<typeof mySt.fields>;
  // Schema.encodeSync(mySt); // Argument of type 'TaggedStruct<Name, Fields>' is not assignable to parameter of type 'Schema<Simplify<Type<{ _tag: tag<Name>; } & Fields>>, Simplify<Encoded<{ _tag: tag<Name>; } & Fields, []>>, never>'
  return mySt;
};

const MyTs = mkTaggedStruct("SignUpUser", {
  email: Schema.String,
  password: Schema.String,
});
Schema.encodeSync(MyTs);

const SignUpUser = Schema.TaggedStruct("SignUpUser", {
  email: Schema.String,
  password: Schema.String,
});

const test2 = make(SignUpUser)({ email: "john", password: "234" });
const test3 = Schema.encodeSync(Schema.parseJson(SignUpUser))(test2);

// export const mkInvoke =
//   (url: string) =>
//   <
//     Name extends LiteralValue,
//     Params extends Schema.Struct.Fields,
//     Result,
//     EncodedResult
//   >(
//     // webFunctionSpec: WebFunctionSpec<Name, Params, Result, EncodedResult>
//     paramsSchema: Schema.TaggedStruct<Name, Params>
//   ) =>
//   (params: Types.Simplify<Struct.Constructor<Params>>) =>
//     pipe(
//       make(paramsSchema)(params),
//       x => x as Types.Simplify<Type<{ _tag: tag<Name> } & Params>>,
//       // // webFunctionSpec.params.make(params),
//       Schema.encodeSync(paramsSchema)
//       // postJson(url),
//       // Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionSpec.result)))
//     );

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
