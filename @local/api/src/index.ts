import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestBody = JSON.parse(event.body || "{}");
  // Do some processing and possibly some side effects
  const responseBody = { message: "Hello from Lambda", input: requestBody };

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
};
