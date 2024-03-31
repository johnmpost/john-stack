import { S } from "./toolbox";

export const listTractors = {
  params: S.struct({ kind: S.literal("listTractors") }),
  result: S.array(S.string),
};

export const compareTractors = {
  params: S.struct({
    kind: S.literal("compareTractors"),
    a: S.string,
    b: S.string,
  }),
  result: S.string,
};
