import express from "express";
import { E, S } from "./exports";
import {
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { ActionHandler, Action, handle, endpoint } from "./john-api";
import { Unit, unit } from "./utils";

const signUpUser = {
  params: S.struct({
    kind: S.literal("signUpUser"),
    email: S.string,
    password: S.string,
  }),
  result: S.eitherFromSelf(
    S.union(InvalidPasswordError, UserAlreadyExistsError),
    Unit
  ),
};

const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.eitherFromSelf(UserDoesNotExistError, Unit),
};

const handleSignUpUser: ActionHandler<typeof signUpUser> = ({
  kind,
  email,
  password,
}) => E.right(unit);

const actions: Action<any, any>[] = [
  { spec: signUpUser, handler: handleSignUpUser },
  handle(requestPasswordReset)(({ kind, email }) => E.right(unit)),
];

const test = endpoint(actions)(
  JSON.stringify({ kind: "signUpUser", email: "myemail", password: "mypass" })
);
console.log(test);

const port = 4000;
const app = express();

app.post("/action", (a, b, c) => {});

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
