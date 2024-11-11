import { ConfigProvider } from "effect";
import { Ef, Layer, pipe } from "../common/toolbox";
import { Client as ClientConfig } from "../common/config";
import { mkUseMutation, mkUseQuery } from "../../libs/restless";
import { createZitadelAuth } from "@zitadel/react";

export const config = pipe(
  ClientConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);

export const useQuery = mkUseQuery(config.restlessServerUrl);
export const useMutation = mkUseMutation(config.restlessServerUrl);

export const zitadel = createZitadelAuth({
  authority: config.zitadelUrl,
  client_id: config.zitadelClientId,
  redirect_uri: "http://localhost:5002/callback",
  post_logout_redirect_uri: "http://localhost:5002/",
  scope: "openid email profile urn:zitadel:iam:user:resourceowner",
});
