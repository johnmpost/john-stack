import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { ConfigProvider, Layer } from "effect";
import { lambdaFailure, lambdaSuccess } from "./dev-utils";
import { Ef, O, flow } from "../common/toolbox";
import {
  createTodo,
  CreateTodo,
  deleteTodo,
  DeleteTodo,
  getTodo,
  GetTodo,
  getTodos,
  GetTodos,
} from "../common/actions";
import { Action, mkAction, mkRequestHandler } from "../../libs/restless";
import { mkDb } from "../common/layers";
import { PgClient } from "@effect/sql-pg";

const SqlLive = mkDb();

const operations = [
  mkAction(GetTodos, getTodos),
  mkAction(CreateTodo, createTodo),
  mkAction(DeleteTodo, deleteTodo),
  mkAction(GetTodo, getTodo),
] as Action<any, any, any, any, any, any, PgClient.PgClient>[];
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
