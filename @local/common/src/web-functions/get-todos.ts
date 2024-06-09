import { Schema } from "@effect/schema";
import { mkWebFunctionDef, WebFunctionImpl } from "../johnapi";
import { Ef } from "../toolbox";
import { Todo } from "../types";

export const GetTodos = mkWebFunctionDef(
  "GetTodos",
  () => ["todos"],
  Schema.Struct({}),
  Schema.Array(Todo),
);

export const getTodos: WebFunctionImpl<typeof GetTodos> = () =>
  Ef.succeed([
    {
      id: "1243kjkj",
      title: "Do Laundry",
      description:
        "I have to do two loads: one for my clothes and one for my towels.",
    },
    {
      id: "23445543",
      title: "Practice Trombone",
      description:
        "I must practice my trombone. I need to do some scales and some etudes.",
    },
  ]);
