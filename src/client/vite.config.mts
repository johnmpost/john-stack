import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteEnvPrefix, Client as ClientConfig } from "../common/config";
import { Ef, Layer, pipe } from "../common/toolbox";
import { ConfigProvider } from "effect";

export default (mode: string) => {
  const envFromFile = loadEnv(mode, ".", viteEnvPrefix);
  const env = { ...envFromFile, ...process.env };
  pipe(
    ClientConfig,
    Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(env))),
    Ef.runSync,
  );

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir: "../..",
    envPrefix: viteEnvPrefix,
  });
};
