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
      Sql.schema.findOne({
        Request: Schema.String,
        Result: Todo,
        execute: id => sql`SELECT * FROM todos WHERE id = ${id}`,
      })(id),
    ),
    Ef.orDie,
    Ef.flatten,
    Ef.mapError(() => NotFound.make({})),
  );

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: OperationImpl<
  typeof CreateTodo,
  Sql.client.Client
> = todo =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(
      sql =>
        Sql.schema.single({
          Request: Todo,
          Result: Todo,
          execute: todo => sql`
        INSERT INTO todos
        ${sql.insert(todo)}
        RETURNING todos.*`,
        })(todo),
      // TODO: return error if UUID already exists
    ),
    Ef.orDie,
  );

export const UpdateTodo = mkMutationDef("UpdateTodo", Todo, Todo, NotFound);
export const updateTodo: OperationImpl<
  typeof UpdateTodo,
  Sql.client.Client
> = todo =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql =>
      Sql.schema.single({
        Request: Todo,
        Result: Todo,
        execute: ({ id, ...rest }) => sql`
        UPDATE todos SET
        ${sql.update(rest)}
        WHERE id = ${id}
        RETURNING todos.*`,
      })(todo),
    ),
    Ef.orDie,
    Ef.mapError(e => NotFound.make({})),
  );
