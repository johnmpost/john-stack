import { tests } from "@local/common/src/fununit/define";
import { multiply } from "./utils";

tests(
  [
    ["identity", [1, 45], 45],
    ["zero", [0, 45], 0],
    ["dummy", [0, 45], 46],
  ],
  ["multiply"],
  ([a, b]) => multiply(a)(b),
);
