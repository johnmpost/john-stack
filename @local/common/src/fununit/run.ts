import { build } from "esbuild";
import glob from "tiny-glob";
import { evaluateTest, ExtendedGlobal, Result } from "./lib";

export const discoverAndRun = async (
  globPath: string,
  showResults: (results: Result<any, any>[]) => string,
) => {
  const files = await glob(globPath);
  const allTestsTs = files.map(f => `import './${f}'`).join(";\n");

  const built = await build({
    stdin: {
      contents: allTestsTs,
      loader: "ts",
      resolveDir: ".",
    },
    bundle: true,
    treeShaking: true,
    platform: "node",
    target: "node20",
    format: "esm",
    resolveExtensions: [".ts", ".js", ".cjs", ".mjs"],
    minify: false,
    write: false,
  });
  const allTestsJs = Buffer.concat(
    built.outputFiles.map(({ contents }) => contents),
  ).toString();

  (globalThis as any as ExtendedGlobal).fununit = {
    tests: [],
  };
  Function(allTestsJs)();
  const discoveredTests = (globalThis as any as ExtendedGlobal).fununit.tests;
  console.log(showResults(discoveredTests.map(evaluateTest)));
};
