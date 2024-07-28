import { tests } from "./fununit/define";
import { prefix } from "./utils";

tests(
  [
    ["name1", "john", "hello john"],
    ["name2", "matthew", "hello matthew"],
    ["name3", "matthew", "hello john"],
  ],
  ["utils"],
  prefix("hello "),
);
