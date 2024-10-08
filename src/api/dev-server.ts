import express from "express";
import { Request, Response } from "express";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";
import { text } from "body-parser";
import { handler } from "./main";

type LambdaHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => Promise<APIGatewayProxyStructuredResultV2>;

const lambdaProxyWrapper =
  (handler: LambdaHandler) => (req: Request, res: Response) =>
    handler(
      {
        body: req.body,
      } as APIGatewayProxyEventV2,
      {} as Context,
    ).then(result => res.status(result.statusCode as number).send(result.body));

const port = process.env.API_DEV_PORT;
const app = express();
app.use(text({ type: "*/*" }));

app.post("/", lambdaProxyWrapper(handler));

app.listen(port, () =>
  console.log(`Api dev server listening at http://localhost:${port}`),
);
