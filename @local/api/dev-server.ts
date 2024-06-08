import express from "express";
import { Request, Response } from "express";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { text } from "body-parser";
import { handler } from "./src";

type LambdaHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => Promise<APIGatewayProxyResultV2>;

const lambdaProxyWrapper =
  (handler: LambdaHandler) => (req: Request, res: Response) =>
    handler(
      {
        body: req.body,
      } as APIGatewayProxyEventV2,
      {} as Context,
    ).then(result => res.status(200).send(result));

const port = process.env.DEV_SERVER_PORT || 4000;
const app = express();
app.use(text({ type: "*/*" }));

app.post("/", lambdaProxyWrapper(handler));

app.listen(port, () =>
  console.log(`Api dev server listening at http://localhost:${port}`),
);
