import express from "express";
import { E, S } from "./exports";

type Unit = {};
const unit = {};

type ResultParseError = { kind: "resultParseError" };

const signUpUser = {
  params: S.struct({
    kind: S.literal("signUpUser"),
    email: S.string,
    password: S.string,
  }),
  result: S.eitherFromSelf(
    S.struct({ kind: S.literal("userAlreadyExistsError") }),
    S.undefined
  ),
};

const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.eitherFromSelf(
    S.struct({ kind: S.literal("userDoesNotExistError") }),
    S.undefined
  ),
};

type Action<P, R> = { params: S.Schema<P>; result: S.Schema<R> };

declare const invoke: <P, R>(
  action: Action<P, R>
) => (params: Omit<P, "kind">) => E.Either<ResultParseError, R>;

const test = invoke(signUpUser)({
  email: "john@post.com",
  password: "admin1",
});

const port = 4000;
const app = express();

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
