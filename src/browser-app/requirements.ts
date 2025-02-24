import { Ef, Layer, pipe } from "../common/toolbox.ts";
import { BrowserAppConfig } from "../common/config.ts";
import { ConfigProvider } from "effect";
import { mkUseMutation, mkUseQuery } from "../../libs/restless";
import { createZitadelAuth } from "@zitadel/react";
import { createContext, useContext } from "react";

export const config = pipe(
  BrowserAppConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);

export const useQuery = mkUseQuery(config.apiServiceUrl);
export const useMutation = mkUseMutation(config.apiServiceUrl);

export const zitadel = createZitadelAuth({
  authority: config.zitadelUrl,
  client_id: config.zitadelClientId,
  redirect_uri: "http://localhost:5002/callback",
  post_logout_redirect_uri: "http://localhost:5002/",
  scope: "openid email profile urn:zitadel:iam:user:resourceowner",
});

export const requirements = { useQuery, useMutation, zitadel };
export const RequirementsContext = createContext<
  typeof requirements | undefined
>(undefined);
export const useRequirements = () => {
  const requirements = useContext(RequirementsContext);
  if (requirements === undefined) {
    throw "this hook doesn't have access to a requirements context provider";
  }
  return requirements;
};
