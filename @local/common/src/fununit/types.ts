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
