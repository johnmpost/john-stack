import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { parseConfig } from "@local/common/src/utils";
import { Client } from "@local/common/src/config";

const envPrefix = "CLIENT_";
const envDir = "../..";

export default (mode: string) => {
  const env = loadEnv(mode, envDir, envPrefix);
  parseConfig(Client)(env); // will throw on build if invalid env

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir,
    envPrefix,
  });
};
