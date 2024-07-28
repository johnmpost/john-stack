import { Schema } from "@effect/schema";
import { Ef, M } from "./toolbox";
import { Todo } from "./types";
import { ActionImpl, mkMutationDef, mkQueryDef } from "./restless";
import { NotFound } from "./errors";
import * as Sql from "@effect/sql";
import { flow, pipe } from "effect";
import { getTodos as _getTodos, getTodo as _getTodo } from "./queries";

export const GetTodos = mkQueryDef(
  "GetTodos",
  Schema.Struct({}),
  () => ["todos"],
  Schema.Array(Todo),
  Schema.Never,
);
export const getTodos: ActionImpl<typeof GetTodos, Sql.client.Client> = () =>
  pipe(_getTodos, Ef.orDie);

const flatDie = <T>(e: T) => {
  throw e;
};

export const GetTodo = mkQueryDef(
  "GetTodo",
  Schema.Struct({ id: Schema.String }),
  ({ id }) => ["todos", id],
  Todo,
  NotFound,
);
export const getTodo: ActionImpl<typeof GetTodo, Sql.client.Client> = ({
  id,
}) =>
  pipe(
    _getTodo(id),
    Ef.mapError(
      flow(
        M.value,
        M.tag("NoSuchElementException", () => NotFound.make({})),
        M.orElse(flatDie),
      ),
      // M.valueTags({
      //   NoSuchElementException: () => NotFound.make({}),
      //   ParseError: flatDie,
      //   SqlError: flatDie,
      // }),
    ),
  );

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: ActionImpl<
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
export const updateTodo: ActionImpl<
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

export const DeleteTodo = mkMutationDef(
  "DeleteTodo",
  Schema.String,
  Schema.Void,
  NotFound,
);
export const deleteTodo: ActionImpl<
  typeof DeleteTodo,
  Sql.client.Client
> = id =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql =>
      Sql.schema.single({
        Request: Schema.String,
        Result: Todo,
        execute: id =>
          sql`
        DELETE FROM todos
        WHERE id = ${id}
        RETURNING todos.*`,
      })(id),
    ),
    Ef.orDie,
  );
