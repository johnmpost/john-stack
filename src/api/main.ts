import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import * as Pg from "@effect/sql-pg";
import * as Sql from "@effect/sql";
import { Config, ConfigProvider, Layer, pipe } from "effect";
import { lambdaFailure, lambdaSuccess } from "./utils";
import { Ef, O, flow } from "../common/toolbox";
import { Server } from "../common/config";
import {
  // CreateTodo,
  // createTodo,
  // discoverMe,
  // DiscoverMe,
  // GetTodo,
  // getTodo,
  getTodos,
  GetTodos,
} from "../common/actions";
import { Action, mkAction, mkRequestHandler } from "../../libs/restless";

const SqlLive = Pg.client.layer(
  pipe(
    Server,
    Config.map(({ dbHost, dbPort, dbName, dbUser, dbPassword }) => ({
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUser,
      password: dbPassword,
    })),
  ),
);

const operations = [
  mkAction(GetTodos, getTodos),
  // mkAction(GetTodo, getTodo),
  // mkAction(CreateTodo, createTodo),
  // mkAction(DiscoverMe, discoverMe),
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
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(process.env))),
  Ef.catchAllDefect(e => (console.log(e), Ef.fail({ error: "defect" }))),
  Ef.match({ onFailure: lambdaFailure, onSuccess: lambdaSuccess }),
  Ef.runPromise,
);
