import { Schema } from "@effect/schema";
import { Ef, pipe } from "./toolbox";
import { Todo } from "./types";
import { Impl, mkQueryDef } from "./johnapi";

export const GetTodos = mkQueryDef(
  "GetTodos",
  Schema.Struct({}),
  Schema.Array(Todo),
  () => ["todos"],
);

export const getTodos: Impl<typeof GetTodos> = () =>
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
  Schema.Either({ left: Schema.String, right: Todo }),
  ({ id }) => ["todo", id],
);

export const getTodo: Impl<typeof GetTodo> = () =>
  pipe(
    Ef.succeed({
      id: "8765",
      title: "Single Todo",
      description: "Just one. Gotten via GetTodo.",
    }),
    Ef.either,
  );

// export const CreateTodo = mkWebFunctionDef(
//   "CreateTodo",
//   Todo,
//   Schema.Either({ left: Schema.String, right: Schema.Struct({}) }),
// );

// export const createTodo: WebFunctionImpl<typeof CreateTodo> = () =>
//   pipe(Ef.succeed({}), Ef.either);
