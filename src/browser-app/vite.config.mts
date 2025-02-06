import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  viteEnvPrefix,
  BrowserAppConfig as ClientConfig,
} from "../common/config";
import { Ef, Layer, pipe } from "../common/toolbox";
import { ConfigProvider } from "effect";

export default () => {
  // fails the build if environment variables are missing
  pipe(
    ClientConfig,
    Ef.provide(Layer.setConfigProvider(ConfigProvider.fromEnv())),
    Ef.runSync,
  );

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir: "../..",
    envPrefix: viteEnvPrefix,
  });
};
