import { Schema } from "@effect/schema";
import { mkWebFunctionDef, WebFunctionImpl } from "../johnapi";
import { Ef, pipe } from "../toolbox";
import { Todo } from "../types";

export const GetTodo = mkWebFunctionDef(
  "GetTodo",
  ({ id }) => ["todo", id],
  Schema.Struct({ id: Schema.String }),
  Schema.Either({ left: Schema.String, right: Todo }),
);

export const getTodo: WebFunctionImpl<typeof GetTodo> = () =>
  pipe(
    Ef.succeed({
      id: "8765",
      title: "Single Todo",
      description: "Just one. Gotten via GetTodo.",
    }),
    Ef.either,
  );
