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
  ({ id }) => ["todos", id],
  Todo,
  NotFound,
);
export const getTodo: OperationImpl<typeof GetTodo, Sql.client.Client> = ({
  id,
}) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql =>
      Sql.resolver.findById("GetTodoById", {
        Id: Schema.String,
        Result: Todo,
        ResultId: _ => _.id,
        execute: ids => sql`SELECT * FROM todos WHERE ${sql.in("id", ids)}`,
      }),
    ),
    Ef.flatMap(x => x.execute(id)),
    Ef.orDie,
    Ef.flatten,
    Ef.mapError(() => NotFound.make({})),
  );

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: OperationImpl<
  typeof CreateTodo,
  Sql.client.Client
> = ({ id, title, description }) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql =>
      Sql.resolver.ordered("InsertTodo", {
        Request: Todo,
        Result: Todo,
        execute: requests => sql`
        INSERT INTO todos
        ${sql.insert(requests)}
        RETURNING todos.*`,
      }),
    ),
    Ef.flatMap(x => x.execute({ id, title, description })),
    Ef.orDie,
  );
