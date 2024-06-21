import { Schema } from "@effect/schema";
import { Ef } from "./toolbox";
import { Todo } from "./types";
import { OperationImpl, mkMutationDef, mkQueryDef } from "./johnapi";
import { NotFound } from "./errors";
import * as Sql from "@effect/sql";
import { pipe } from "effect";

export const GetTodos = mkQueryDef(
  "GetTodos",
  Schema.Struct({}),
  () => ["todos"],
  Schema.Array(Todo),
  Schema.Never,
);
export const getTodos: OperationImpl<typeof GetTodos, Sql.client.Client> = () =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql => sql<Todo>`SELECT id, title, description FROM todos`),
    Ef.orDie,
  );

export const GetTodo = mkQueryDef(
  "GetTodo",
  Schema.Struct({ id: Schema.String }),
  ({ id }) => ["todo", id],
  Todo,
  NotFound,
);
export const getTodo: OperationImpl<typeof GetTodo, never> = () =>
  Ef.succeed({
    id: "8765",
    title: "Single Todo",
    description: "Just one. Gotten via GetTodo.",
  });

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: OperationImpl<typeof CreateTodo, never> = ({
  id,
  title,
  description,
}) => Ef.succeed({ id, title, description });
