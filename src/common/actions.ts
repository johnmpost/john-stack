import { Schema } from "@effect/schema";
import { Ef, M } from "./toolbox";
import { Todo } from "./types";
import { ActionImpl, mkMutationDef, mkQueryDef } from "../../libs/restless";
import { NotFound } from "./errors";
import * as Sql from "@effect/sql";
import { Config, pipe } from "effect";
import {
  getTodos as _getTodos,
  getTodo as _getTodo,
  createTodo as _createTodo,
  updateTodo as _updateTodo,
  deleteTodo as _deleteTodo,
} from "./queries";
import { Server } from "./config";

const NoInput = Schema.Struct({});

const flatDie = <T>(e: T) => {
  throw e;
};

const killDefects = { SqlError: flatDie, ParseError: flatDie };

export const GetTodos = mkQueryDef(
  "GetTodos",
  NoInput,
  () => ["todos"],
  Schema.Array(Todo),
  Schema.Never,
);
export const getTodos: ActionImpl<typeof GetTodos, Sql.client.Client> = () =>
  pipe(_getTodos, Ef.mapError(M.valueTags(killDefects)));

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
      M.valueTags({
        ...killDefects,
        NoSuchElementException: () => NotFound.make({}),
      }),
    ),
  );

export const CreateTodo = mkMutationDef("CreateTodo", Todo, Todo, Schema.Never);
export const createTodo: ActionImpl<
  typeof CreateTodo,
  Sql.client.Client
> = todo => pipe(_createTodo(todo), Ef.mapError(M.valueTags(killDefects)));

export const UpdateTodo = mkMutationDef("UpdateTodo", Todo, Todo, NotFound);
export const updateTodo: ActionImpl<
  typeof UpdateTodo,
  Sql.client.Client
> = todo =>
  pipe(
    _updateTodo(todo),
    Ef.mapError(
      M.valueTags({
        ...killDefects,
        NoSuchElementException: () => NotFound.make({}),
      }),
    ),
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
    _deleteTodo(id),
    Ef.mapError(
      M.valueTags({
        ...killDefects,
        NoSuchElementException: () => NotFound.make({}),
      }),
    ),
  );

export const DiscoverMe = mkQueryDef(
  "DiscoverMe",
  Schema.Struct({ accessToken: Schema.String }),
  () => ["whoami"],
  Schema.String,
  Schema.Never,
);
export const discoverMe: ActionImpl<
  typeof DiscoverMe,
  Config.Config<typeof Server>
> = ({ accessToken }) => {
  const introspectUrl = (root: string) => `${root}/oauth/v2/introspect`;
  const auth = (clientId: string, clientSecret: string) =>
    Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  return pipe(
    Server,
    Ef.flatMap(({ zitadelClientId, zitadelClientSecret, zitadelUrl }) =>
      Ef.promise(() =>
        fetch(introspectUrl(zitadelUrl), {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth(zitadelClientId, zitadelClientSecret)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token: accessToken,
            token_type_hint: "access_token",
          }),
        }).then(resp => resp.text()),
      ),
    ),
    Ef.mapError(flatDie),
  );
};
