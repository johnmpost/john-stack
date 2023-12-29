import express from "express";
import { A, E, S, match } from "./exports";
import { UserAlreadyExistsError, UserDoesNotExistError } from "./errors";
import { Action, ActionSpec, Unit, invoke } from "./utils";

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

const handleSignUpUser = ({
  kind,
  email,
  password,
}: S.Schema.To<typeof signUpUser.params>): S.Schema.To<
  typeof signUpUser.result
> => E.right(Unit);

const handleRequestPasswordReset = ({}: S.Schema.To<
  typeof requestPasswordReset.params
>): S.Schema.To<typeof requestPasswordReset.result> => E.right(Unit);

const actions = [
  [signUpUser, handleSignUpUser],
  [requestPasswordReset, handleRequestPasswordReset],
];

const invoking = invoke(signUpUser)({
  email: "john@post.com",
  password: "admin1",
});

const endpoint = (requestBody: string) =>
  S.parseOption(signUpUser.params)(requestBody);

const port = 4000;
const app = express();

app.post("/action", (a, b, c) => {});

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
