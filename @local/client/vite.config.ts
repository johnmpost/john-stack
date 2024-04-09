import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { client, parseConfig } from "@local/common/src/config";

const envPrefix = "CLIENT_";
const envDir = "../..";

export default (mode: string) => {
  const env = loadEnv(mode, envDir, envPrefix);
  parseConfig(client)(env); // will throw on build if config not correct

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir,
    envPrefix,
  });
};
