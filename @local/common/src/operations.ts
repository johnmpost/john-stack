import { Schema } from "@effect/schema";
import { Ef } from "./toolbox";
import { Todo } from "./types";
import { OperationImpl, mkMutationDef, mkQueryDef } from "./johnapi";
import { NotFound } from "./errors";
import * as Sql from "@effect/sql";
import * as Pg from "@effect/sql-pg";
import { Config, pipe } from "effect";
import { Server } from "./config";

const Db = Pg.client.layer(
  Config.map(({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD }) => ({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
  }))(Server),
);

export const GetTodos = mkQueryDef(
  "GetTodos",
  Schema.Struct({}),
  () => ["todos"],
  Schema.Array(Todo),
  Schema.Never,
);
export const getTodos: OperationImpl<typeof GetTodos> = () =>
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
export const getTodo: OperationImpl<typeof GetTodo> = () =>
  Ef.succeed({
    id: "8765",
    title: "Single Todo",
    description: "Just one. Gotten via GetTodo.",
  });

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: OperationImpl<typeof CreateTodo> = ({
  id,
  title,
  description,
}) => Ef.succeed({ id, title, description });
