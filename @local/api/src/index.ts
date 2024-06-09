import { mkRequestHandler } from "@local/common/src/johnapi";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { operations } from "./operations";
import { Ef, flow, O } from "@local/common/src/toolbox";

export const handler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyResultV2> = flow(
  event => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  mkRequestHandler(operations),
  Ef.runPromise,
);
