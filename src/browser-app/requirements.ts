import { Ef, Layer, pipe } from "../common/toolbox.ts";
import { BrowserAppConfig } from "../common/config.ts";
import { ConfigProvider } from "effect";
import { mkUseMutation, mkUseQuery } from "../../libs/restless";
import { createZitadelAuth } from "@zitadel/react";
import { createContext, useContext, useEffect } from "react";
import {
  useQuery as usePromiseQuery,
  useQueryClient,
} from "@tanstack/react-query";

const config = pipe(
  BrowserAppConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);

const useQuery = mkUseQuery(config.apiServiceUrl);
const useMutation = mkUseMutation(config.apiServiceUrl);

const zitadel = createZitadelAuth({
  authority: config.zitadelUrl,
  client_id: config.zitadelClientId,
  redirect_uri: "http://localhost:5002/callback",
  post_logout_redirect_uri: "http://localhost:5002/",
  scope: "openid email profile urn:zitadel:iam:user:resourceowner",
});

const useUser = () => {
  const queryClient = useQueryClient();
  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  useEffect(() => {
    console.log(user);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    if (user === null || user?.expired) {
      // zitadel.authorize();
    }
  }, [user]);

  return user;
};

export const requirements = { useQuery, useMutation, zitadel, useUser };
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
