import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  Client as ClientConfig,
  viteEnvPrefix,
} from "@local/common/src/config";
import { ConfigProvider, Ef, Layer, pipe } from "@local/common/src/toolbox";

const envDir = "../..";

export default (mode: string) => {
  const envFromFile = loadEnv(mode, envDir, viteEnvPrefix);
  const env = { ...envFromFile, ...process.env };
  pipe(
    ClientConfig,
    Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(env))),
    Ef.runSync,
  ); // will throw if config not fully provided during build

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir,
    envPrefix: viteEnvPrefix,
  });
};
