import express from "express";
import { Either } from "effect";

// type Action<I, O> = { in: I; out: O };

// type Action = { kind: "signUpUser" } | { kind: "otherAction" };

type UserAlreadyExistsError = { kind: "userAlreadyExistsError" };

type ActionHandler<Params, Result> = (params: Params) => Result;

type SignUpUser = ActionHandler<{ kind: "signUpUser" }, Either.Either<{}, {}>>;

type Endpoint = (body: string) => string;

// get request body
// parse it into one of the actions input

const port = 4000;
const app = express();

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);