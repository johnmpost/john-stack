import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as S from "@effect/schema/Schema";
import { client } from "@local/common/src/config";

const envPrefix = "CLIENT_";
const envDir = "../..";

export default (mode: string) => {
  const env = loadEnv(mode, envDir, envPrefix);
  const test = S.decodeUnknownSync(client)(env);
  console.log(test);

  return defineConfig({
    plugins: [react()],
    cacheDir: ".vite_cache",
    envDir,
    envPrefix,
  });
};
