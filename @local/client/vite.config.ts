import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as S from "@effect/schema/Schema";

const envPrefix = "CLIENT_";
const envDir = "../..";

export const client = S.struct({ CLIENT_API_HOSTNAME: S.string });

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
