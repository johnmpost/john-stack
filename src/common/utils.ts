import { Server } from "./config";
import { Ef, pipe, Schema } from "./toolbox";
import { IntrospectResult } from "./types";

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

export const introspect = (accessToken: string) =>
  pipe(
    Server,
    Ef.flatMap(({ zitadelClientId, zitadelClientSecret, zitadelUrl }) =>
      Ef.promise(() =>
        fetch(tokenIntrospectUrl(zitadelUrl), {
          method: "POST",
          headers: {
            Authorization: `Basic ${encodedBasicAuth(zitadelClientId, zitadelClientSecret)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token: accessToken,
            token_type_hint: "access_token",
          }),
        }).then(resp => resp.text()),
      ),
    ),
    Ef.flatMap(Schema.decode(Schema.parseJson(IntrospectResult))),
  );
