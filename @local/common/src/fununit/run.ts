import { build } from "esbuild";
import glob from "tiny-glob";
import { ExtendedGlobal } from "./types";
import { evaluateTest, showResultsVerbose } from "./lib";

export const discoverAndRun = async (globPath: string) => {
  const files = await glob(globPath);
  const allTestsTs = files.map(f => `import './${f}'`).join(";\n");

  const built = await build({
    stdin: {
      contents: allTestsTs,
      loader: "ts",
      resolveDir: ".",
    },
    // outdir: 'not_a_real_directory',
    bundle: true,
    // splitting: false,
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
  console.log(showResultsVerbose(discoveredTests.map(evaluateTest)));
};

const [, , globPath] = process.argv;
discoverAndRun(globPath);
