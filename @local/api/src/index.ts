import { mkRequestHandler } from "@local/common/src/johnapi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { webFunctions } from "./web-functions";
import { Ef, flow, O } from "@local/common/src/toolbox";

const handleRequest = mkRequestHandler(webFunctions);

export const handler = flow(
  (event: APIGatewayProxyEvent) => event.body,
  O.fromNullable,
  O.getOrElse(() => ""),
  handleRequest,
  Ef.map(body => ({ statusCode: 200, body } as APIGatewayProxyResult)),
  Ef.runPromise
);
