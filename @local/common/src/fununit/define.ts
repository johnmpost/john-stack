import { mkTests, Case, ExtendedGlobal } from "./lib";

export const tests = <I, O>(
  cases: Case<I, O>[],
  namespace: string[],
  exec: (x: I) => O,
) => {
  const createdTests = mkTests(cases, namespace, exec);
  (globalThis as any as ExtendedGlobal).fununit.tests.push(...createdTests);
};
