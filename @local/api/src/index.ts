import { mkRequestHandler } from "@local/common/src/johnapi";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Ef, flow, O } from "@local/common/src/toolbox";
import { mkOperation, Operation } from "@local/common/src/johnapi";
import {
  getTodo,
  GetTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/operations";

export const operations = [
  mkOperation(GetTodos, getTodos),
  mkOperation(GetTodo, getTodo),
] as Operation<any, any, any, any, any, any>[];

export const handler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyResultV2> = flow(
  event => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  mkRequestHandler(operations),
  Ef.runPromise,
);
