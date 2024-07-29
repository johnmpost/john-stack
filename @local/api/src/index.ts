import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { Ef, flow, O } from "@local/common/src/toolbox";
import { Action, mkAction, mkRequestHandler } from "@local/common/src/restless";
import {
  createTodo,
  CreateTodo,
  getTodo,
  GetTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/actions";
import * as Pg from "@effect/sql-pg";
import * as Sql from "@effect/sql";
import { Config } from "effect";
import { Server } from "@local/common/src/config";
import { lambdaFailure, lambdaSuccess } from "./utils";

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
  mkAction(GetTodos, getTodos),
  mkAction(GetTodo, getTodo),
  mkAction(CreateTodo, createTodo),
] as Action<any, any, any, any, any, any, Sql.client.Client>[];
// TODO somehow infer requirements correctly

const handleRequest = mkRequestHandler(operations);

export const handler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyStructuredResultV2> = flow(
  event => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  handleRequest,
  Ef.provide(SqlLive),
  Ef.catchAllDefect(e => (console.log(e), Ef.fail({ error: "defect" }))),
  Ef.match({ onFailure: lambdaFailure, onSuccess: lambdaSuccess }),
  Ef.runPromise,
);
