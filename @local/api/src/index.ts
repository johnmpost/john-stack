import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Ef, flow, O } from "@local/common/src/toolbox";
import {
  mkOperation,
  Operation,
  mkRequestHandler,
} from "@local/common/src/restless";
import {
  createTodo,
  CreateTodo,
  getTodo,
  GetTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/operations";
import * as Pg from "@effect/sql-pg";
import * as Sql from "@effect/sql";
import { Config } from "effect";
import { Server } from "@local/common/src/config";

const SqlLive = Pg.client.layer(
  Config.map(({ dbHost, dbPort, dbName, dbUser, dbPassword }) => ({
    host: dbHost,
    port: dbPort,
    database: dbName,
    username: dbUser,
    password: dbPassword,
  }))(Server),
);

const operations = [
  mkOperation(GetTodos, getTodos),
  mkOperation(GetTodo, getTodo),
  mkOperation(CreateTodo, createTodo),
] as Operation<any, any, any, any, any, any, Sql.client.Client>[];
// TODO somehow infer requirements correctly

const handleRequest = mkRequestHandler(operations);

export const handler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyResultV2> = flow(
  event => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  handleRequest,
  Ef.provide(SqlLive),
  Ef.runPromise,
);
