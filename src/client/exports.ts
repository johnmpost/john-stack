import { ConfigProvider } from "effect";
import { Ef, Layer, pipe } from "../common/toolbox";
import { Client as ClientConfig } from "../common/config";
import { mkUseMutation, mkUseQuery } from "../../libs/restless";

export const config = pipe(
  ClientConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);

export const useQuery = mkUseQuery(config.restlessServerUrl);
export const useMutation = mkUseMutation(config.restlessServerUrl);
