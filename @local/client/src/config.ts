import { Client as ClientConfig } from "@local/common/src/config";
import { ConfigProvider, Ef, Layer, pipe } from "@local/common/src/toolbox";

export const config = pipe(
  ClientConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);
