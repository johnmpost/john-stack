import { Schema } from "@effect/schema";
import { mkWebFunctionDef, WebFunctionImpl } from "../johnapi";
import { Ef } from "../toolbox";
import { Todo } from "../types";

export const GetTodos = mkWebFunctionDef(
  "GetTodos",
  Schema.Struct({}),
  Schema.Array(Todo)
);

export const getTodos: WebFunctionImpl<typeof GetTodos> = () =>
  Ef.succeed([
    {
      title: "Do Laundry",
      description:
        "I have to do two loads: one for my clothes and one for my towels.",
    },
    {
      title: "Practice Trombone",
      description:
        "I must practice my trombone. I need to do some scales and some etudes.",
    },
  ]);
