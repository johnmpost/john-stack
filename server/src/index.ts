import express from "express";
import { E, S, pipe } from "./exports";
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

const port = 4000;
const app = express();
app.use(express.json());

app.post("/action", (req, res) =>
  pipe(req.body, JSON.stringify, endpoint(actions), (x) =>
    res.status(200).json(x)
  )
);

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);

fetch("http://localhost:4000/action", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    kind: "signUpUser",
    email: "john@post.com",
    password: "mypass",
  }),
})
  .then((x) => x.json())
  .then(console.log);
