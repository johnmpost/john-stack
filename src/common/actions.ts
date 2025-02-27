import { Ef, M } from "./toolbox";
import { Todo } from "./types";
import { ActionImpl, mkMutationDef, mkQueryDef } from "../../libs/restless";
import { NotAuthorized, NotFound } from "./errors";
import { pipe, Schema } from "effect";
import {
  getTodos as _getTodos,
  createTodo as _createTodo,
  deleteTodo as _deleteTodo,
  getTodo as _getTodo,
} from "./queries";
import { flatDie } from "./utils";
import { introspect } from "./helpers";
import { SqlClient } from "@effect/sql";

// const NoInput = Schema.Struct({});
const WithAccessToken = Schema.Struct({ accessToken: Schema.String });

const killDefects = {
  SqlError: flatDie,
  ParseError: flatDie,
  ConfigError: flatDie,
};

export const GetTodos = mkQueryDef(
  "GetTodos",
  WithAccessToken,
  () => ["todos"],
  Schema.Array(Todo),
  NotAuthorized, // currently is actually Void, need to make `introspect` more specific
);
export const getTodos: ActionImpl<typeof GetTodos, SqlClient.SqlClient> = ({
  accessToken,
}) =>
  pipe(
    accessToken,
    introspect,
    Ef.map(x => x["urn:zitadel:iam:user:resourceowner:id"]),
    Ef.flatMap(_getTodos),
    Ef.mapError(M.valueTags(killDefects)),
  );

export const GetTodo = mkQueryDef(
  "GetTodo",
  Schema.Struct({ id: Schema.String }).pipe(Schema.extend(WithAccessToken)),
  ({ id }) => ["todo", id],
  Todo,
  Schema.Union(NotFound, NotAuthorized),
);
export const getTodo: ActionImpl<typeof GetTodo, SqlClient.SqlClient> = ({
  id,
  accessToken,
}) =>
  pipe(
    accessToken,
    introspect,
    Ef.map(x => x["urn:zitadel:iam:user:resourceowner:id"]),
    Ef.flatMap(_getTodo(id)),
    Ef.mapError(
      M.valueTags({
        ...killDefects,
        NoSuchElementException: () => NotFound.make({}),
      }),
    ),
  );

export const CreateTodo = mkMutationDef(
  "CreateTodo",
  Schema.Struct({ todo: Todo.pipe(Schema.omit("orgId")) }).pipe(
    Schema.extend(WithAccessToken),
  ),
  Todo,
  NotAuthorized,
);
export const createTodo: ActionImpl<typeof CreateTodo, SqlClient.SqlClient> = ({
  todo,
  accessToken,
}) =>
  pipe(
    accessToken,
    introspect,
    Ef.map(x => x["urn:zitadel:iam:user:resourceowner:id"]),
    Ef.map(orgId => ({ ...todo, orgId })),
    Ef.flatMap(_createTodo),
    Ef.mapError(M.valueTags(killDefects)),
  );

export const DeleteTodo = mkMutationDef(
  "DeleteTodo",
  Schema.Struct({ todoId: Schema.String }).pipe(Schema.extend(WithAccessToken)),
  Todo,
  Schema.Union(NotFound, NotAuthorized),
);
export const deleteTodo: ActionImpl<typeof DeleteTodo, SqlClient.SqlClient> = ({
  todoId,
  accessToken,
}) =>
  pipe(
    accessToken,
    introspect,
    Ef.map(x => x["urn:zitadel:iam:user:resourceowner:id"]),
    Ef.flatMap(_deleteTodo(todoId)),
    Ef.mapError(
      M.valueTags({
        ...killDefects,
        NoSuchElementException: () => NotFound.make({}),
      }),
    ),
  );

// export const deleteTodo: ActionImpl<
//   typeof DeleteTodo,
//   Sql.client.Client
// > = id =>
//   pipe(
//     _deleteTodo(id),
//     Ef.mapError(
//       M.valueTags({
//         ...killDefects,
//         NoSuchElementException: () => NotFound.make({}),
//       }),
//     ),
//   );
