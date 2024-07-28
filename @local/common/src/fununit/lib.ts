import assert from "assert";

export type Case<I, O> = [string, I, O];

export type Test<I, O> = {
  id: string[];
  input: I;
  expected: O;
  exec: (x: I) => O;
};

export type Result<I, O> = {
  id: string[];
  input: I;
  expected: O;
  actual: O;
  isSuccess: boolean;
};

export type ExtendedGlobal = { fununit: { tests: Test<any, any>[] } };

const testFromCase =
  <I, O>(namespace: string[], exec: (x: I) => O) =>
  ([caseName, input, expected]: Case<I, O>) =>
    ({
      id: [...namespace, caseName],
      input,
      expected,
      exec,
    }) as Test<I, O>;

export const mkTests = <I, O>(
  cases: Case<I, O>[],
  namespace: string[],
  exec: (x: I) => O,
) => cases.map(testFromCase(namespace, exec));

const areDeepStrictEqual = (a: unknown, b: unknown) => {
  try {
    assert.deepStrictEqual(a, b);
    return true;
  } catch (e) {
    if (e instanceof assert.AssertionError) {
      return false;
    }
    throw e;
  }
};

export const evaluateTest = <I, O>(test: Test<I, O>) => {
  const actual = test.exec(test.input);
  const isSuccess = areDeepStrictEqual(actual, test.expected);
  return { ...test, actual, isSuccess } as Result<I, O>;
};

const indentLines = (numSpaces: number, s: string) => {
  const spaces = " ".repeat(numSpaces);
  return s
    .split("\n")
    .map(line => `${spaces}${line}`)
    .join("\n");
};

const showFailureDetail = (r: Result<any, any>) =>
  `parameters = ${r.input}\nexpected = ${r.expected}\nactual = ${r.actual}`;

const showResult = (r: Result<any, any>) =>
  `${r.isSuccess ? "PASSED" : "FAILED"} ${r.id.join(".")}${r.isSuccess ? "" : `\n${indentLines(4, showFailureDetail(r))}`}`;

export const showResultsVerbose = (results: Result<any, any>[]) => {
  const failures = results.filter(r => !r.isSuccess);
  const summary = `${results.length} tests run, ${failures.length} failed`;
  const shownResults = results.map(showResult).join("\n");
  return `${summary}${results.length > 0 ? "\n" + shownResults : ""}`;
};

export const showResults = (results: Result<any, any>[]) => {
  const failures = results.filter(r => !r.isSuccess);
  const summary = `${results.length} tests run, ${failures.length} failed`;
  const shownResults = failures.map(showResult).join("\n");
  return `${summary}${failures.length > 0 ? "\n" + shownResults : ""}`;
};
