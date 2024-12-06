import { Schema } from "./toolbox";

export const flatDie = <T>(e: T) => {
  throw e;
};

export const helloWorld = "hello world";

export const Unit = Schema.TaggedStruct("Unit", {});
export type Unit = typeof Unit.Type;
export const unit: Unit = Unit.make({});

export const prefix =
  <P extends string>(p: P) =>
  <S extends string>(s: S): `${P}${S}` =>
    `${p}${s}`;

export const tokenIntrospectUrl = (zitadelRoot: string) =>
  `${zitadelRoot}/oauth/v2/introspect`;

export const encodedBasicAuth = (clientId: string, clientSecret: string) =>
  Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
