import { flow, pipe, Schema, Ef, O, A, E } from "./toolbox";
import { NetworkError, networkError } from "./errors";
import { LiteralValue } from "@effect/schema/AST";
import type * as Types from "effect/Types";
import { Struct, tag, TypeLiteral } from "@effect/schema/Schema";
import { AST } from "@effect/schema";

type TaggedStructFields = {
  readonly [x: string]: Schema.Schema.AnyNoContext;
};

type TaggedStruct<
  Tag extends AST.LiteralValue,
  Fields extends TaggedStructFields
> = Struct<{ _tag: tag<Tag> } & Fields>;

export type WebFunctionDef<
  Name extends LiteralValue,
  Params extends TaggedStructFields,
  Result,
  EncodedResult
> = {
  params: Schema.TaggedStruct<Name, Params>;
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
  Name extends LiteralValue,
  Params extends TaggedStructFields,
  Result,
  EncodedResult
> = {
  spec: WebFunctionDef<Name, Params, Result, EncodedResult>;
  impl: (params: Params) => Result;
};

export type Invoker = <
  Name extends LiteralValue,
  Params extends TaggedStructFields,
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

type Constraint<T> = "jingle" extends keyof T ? never : T;
const func = <T>(param: Constraint<T>) => param.jingle;
func({ jingle: "pingle" });

type NoContext<T> = Schema.Schema.Context<T> extends never ? T : never;
type NoContextParams<T extends { params: any }> =
  T["params"] extends Schema.Schema.AnyNoContext ? T : never;

type EnforceAllProperties<T, U> = {
  [K in keyof T]: T[K] extends U ? T[K] : never;
};

// const mkTaggedStruct = <
//   Name extends LiteralValue,
//   Fields extends EnforceAllProperties<
// >(
//   name: Name,
//   fields: NoContext<Fields>,
//   toMake: Types.Simplify<
//     Struct.Constructor<{ _tag: tag<Name> } & NoContext<Fields>>
//   >
// ) => {
//   const mySt = Schema.TaggedStruct(name, fields);
//   mySt.make(toMake);
//   Schema.encodeSync(mySt); // Argument of type 'TaggedStruct<Name, Fields>' is not assignable to parameter of type 'Schema<Simplify<Type<{ _tag: tag<Name>; } & Fields>>, Simplify<Encoded<{ _tag: tag<Name>; } & Fields, []>>, never>'
//   return mySt;
// };

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
const mkTaggedStruct = <
  Name extends AST.LiteralValue,
  Fields extends FieldsNoContext
>(
  name: Name,
  fields: Fields
) => {
  const schema = Schema.TaggedStruct(name, fields);
  const schema_: Schema.Schema<typeof schema.Type, typeof schema.Encoded> =
    Schema.TaggedStruct(name, fields) as any;
  Schema.encodeSync(schema_);
  return schema_;
};

const MyTs = mkTaggedStruct("SignUpUser", {
  email: Schema.String,
  password: Schema.String,
});

Schema.encodeSync(MyTs)({ email: "", password: "", _tag: MyTs.Encoded._tag });

type myts = typeof MyTs.Type;

const SignUpUser = Schema.TaggedStruct("SignUpUser", {
  email: Schema.String,
  password: Schema.String,
});
type test = Struct.Context<typeof SignUpUser.fields>;

const test2 = make(SignUpUser)({ email: "john", password: "234" });
const test3 = Schema.encodeSync(Schema.parseJson(SignUpUser))(test2);

export const mkInvoke =
  (url: string) =>
  <
    Name extends LiteralValue,
    Params extends TaggedStructFields,
    Result,
    EncodedResult
  >(
    webFunction: NoContextParams<
      WebFunctionDef<Name, Params, Result, EncodedResult>
    >
  ) =>
  // (params: Types.Simplify<Struct.Constructor<TaggedStructFields>>) =>
  (params: Types.Simplify<Struct.Constructor<{ _tag: tag<Name> } & Params>>) =>
    // (params: Struct.Encoded<Params>) =>
    pipe(
      webFunction.params.make(params),
      x => x,
      // // webFunctionSpec.params.make(params),
      Schema.encodeSync(webFunction.params)
      // postJson(url),
      // Ef.map(Schema.decodeSync(Schema.parseJson(webFunctionSpec.result)))
    );

export const mkWebFunction =
  <Param, EncodedParam, Result, EncodedResult>(
    spec: WebFunctionDef<Param, EncodedParam, Result, EncodedResult>
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
