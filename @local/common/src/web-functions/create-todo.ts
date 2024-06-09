import { Schema } from "@effect/schema";
import { mkWebFunctionDef, WebFunctionImpl } from "../johnapi";
import { Todo } from "../types";
import { Ef, pipe } from "../toolbox";

export const CreateTodo = mkWebFunctionDef(
  "CreateTodo",
  Todo,
  Schema.Either({ left: Schema.String, right: Schema.Struct({}) }),
);

export const createTodo: WebFunctionImpl<typeof CreateTodo> = () =>
  pipe(Ef.succeed({}), Ef.either);
