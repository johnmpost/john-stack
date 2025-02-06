import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export const multiply = (a: number) => (b: number) => a * b;

export const lambdaFailure = (
  e: unknown,
): APIGatewayProxyStructuredResultV2 => ({
  cookies: [],
  isBase64Encoded: false,
  statusCode: 500,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(e),
});

export const lambdaSuccess = (
  body: string,
): APIGatewayProxyStructuredResultV2 => ({
  cookies: [],
  isBase64Encoded: false,
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body,
});
