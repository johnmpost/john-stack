import express from "express";
import { E, S } from "./exports";
import { UserAlreadyExistsError, UserDoesNotExistError } from "./errors";
import { Unit, invoke } from "./utils";

const signUpUser = {
  params: S.struct({
    kind: S.literal("signUpUser"),
    email: S.string,
    password: S.string,
  }),
  result: S.eitherFromSelf(UserAlreadyExistsError, Unit),
};

const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.eitherFromSelf(UserDoesNotExistError, Unit),
};

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
