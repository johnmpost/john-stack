import { Schema } from "@effect/schema";
import { Ef } from "./toolbox";
import { Todo } from "./types";
import { OperationImpl, mkMutationDef, mkQueryDef } from "./johnapi";
import { NotFound } from "./errors";
import * as Pg from "@effect/sql-pg";
import { Config, pipe } from "effect";
import { Server } from "./config";

export const GetTodos = mkQueryDef(
  "GetTodos",
  Schema.Struct({}),
  () => ["todos"],
  Schema.Array(Todo),
  Schema.Never,
);
export const getTodos: OperationImpl<typeof GetTodos> = () =>
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

// const test = Pg.client.layer(
//   Server.pipe(
//     Config.map(({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD }) => ({
//       host: DB_HOST,
//       port: DB_PORT,
//       database: DB_NAME,
//       username: DB_USER,
//       password: DB_PASSWORD,
//     })),
//   ),
// );
