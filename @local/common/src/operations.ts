import { Schema } from "@effect/schema";
import { Ef } from "./toolbox";
import { Todo } from "./types";
import { OperationImpl, mkQueryDef } from "./johnapi";
import { NotFound } from "./errors";

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

// export const CreateTodo = mkWebFunctionDef(
//   "CreateTodo",
//   Todo,
//   Schema.Either({ left: Schema.String, right: Schema.Struct({}) }),
// );

// export const createTodo: WebFunctionImpl<typeof CreateTodo> = () =>
//   pipe(Ef.succeed({}), Ef.either);
