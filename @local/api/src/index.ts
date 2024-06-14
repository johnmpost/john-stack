import { mkRequestHandler } from "@local/common/src/johnapi";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Ef, flow, O } from "@local/common/src/toolbox";
import { mkOperation, Operation } from "@local/common/src/johnapi";
import {
  createTodo,
  CreateTodo,
  getTodo,
  GetTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/operations";
import * as Sql from "@effect/sql";
import * as Pg from "@effect/sql-pg";
import { Config } from "effect";
import { Server } from "@local/common/src/config";

const operations = [
  mkOperation(GetTodos, getTodos),
  mkOperation(GetTodo, getTodo),
  mkOperation(CreateTodo, createTodo),
] as Operation<any, any, any, any, any, any>[];

const SqlLive = Pg.client.layer(
  Config.map(({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD }) => ({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
  }))(Server),
);

const handleRequest = mkRequestHandler(operations);

export const handler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyResultV2> = flow(
  event => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  handleRequest,
  Ef.runPromise,
);
