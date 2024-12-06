import { Server } from "./config";
import { Ef, pipe, Schema } from "./toolbox";
import { IntrospectResult } from "./types";
import { encodedBasicAuth, tokenIntrospectUrl } from "./utils";

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
