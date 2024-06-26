import { pipe } from "effect";
import { Ef, Schema, Sql } from "./toolbox";
import { Todo } from "./types";

export const queries = pipe(
  Ef.Do,
  Ef.bind("sql", () => Sql.client.Client),
  Ef.let(
    "getTodos",
    ({ sql }) => sql<Todo>`SELECT id, title, description FROM todos`,
  ),
  Ef.let("getTodo", ({ sql }) =>
    Sql.schema.findOne({
      Request: Schema.String,
      Result: Todo,
      execute: id => sql`SELECT * FROM todos WHERE id = ${id}`,
    }),
  ),
  Ef.let(
    "createTodo",
    ({ sql }) =>
      (todo: Todo) =>
        // Sql.schema.single({
        //   Request: Todo,
        //   Result: Todo,
        // execute: todo =>
        sql`
        INSERT INTO todos
        ${sql.insert(todo)}
        RETURNING todos.*`,

    // }),
  ),
  Ef.let("updateTodo", ({ sql }) =>
    Sql.schema.single({
      Request: Todo,
      Result: Todo,
      execute: ({ id, ...rest }) => sql`
        UPDATE todos SET
        ${sql.update(rest)}
        WHERE id = ${id}
        RETURNING todos.*`,
    }),
  ),
  Ef.let("deleteTodo", ({ sql }) =>
    Sql.schema.single({
      Request: Schema.String,
      Result: Todo,
      execute: id =>
        sql`
        DELETE FROM todos
        WHERE id = ${id}
        RETURNING todos.*`,
    }),
  ),
  Ef.map(({ sql, ...queries }) => queries),
);

queries.pipe(Ef.map(x => x.createTodo));
