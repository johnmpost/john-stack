import { A, Ef, Schema, Sql, pipe } from "./toolbox";
import { Todo } from "./types";

export const getTodos = (orgId: string) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql => sql`SELECT * FROM todos WHERE org_id = ${orgId}`),
    Ef.flatMap(Schema.decodeUnknown(Schema.Array(Todo))),
  );

export const getTodo = (id: string) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(sql => sql`SELECT * FROM todos WHERE id = ${id}`),
    Ef.flatMap(Schema.decodeUnknown(Schema.Array(Todo))),
    Ef.flatMap(A.head),
  );

export const createTodo = (todo: Todo) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(
      sql => sql`INSERT INTO todos ${sql.insert(todo)} RETURNING todos.*`,
    ),
    Ef.flatMap(Schema.decodeUnknown(Schema.Array(Todo))),
    Ef.map(A.unsafeGet(0)),
  );

export const updateTodo = ({ id, ...rest }: Todo) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(
      sql =>
        sql`UPDATE todos SET ${sql.update(rest)} WHERE id = ${id} RETURNING todos.*`,
    ),
    Ef.flatMap(Schema.decodeUnknown(Schema.Array(Todo))),
    Ef.flatMap(A.head),
  );

export const deleteTodo = (id: string) =>
  pipe(
    Sql.client.Client,
    Ef.flatMap(
      sql => sql`DELETE FROM todos WHERE id = ${id} RETURNING todos.*`,
    ),
    Ef.flatMap(Schema.decodeUnknown(Schema.Array(Todo))),
    Ef.flatMap(A.head),
  );
