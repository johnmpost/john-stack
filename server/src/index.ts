import express from "express";
import { E, S } from "./exports";
import { Effect, pipe } from "effect";

type ActionHandler<I, O> = { in: I; out: O };

// type Action = { kind: "signUpUser" } | { kind: "otherAction" };

type UserAlreadyExistsError = { kind: "userAlreadyExistsError" };
type UserDoesNotExistError = { kind: "userDoesNotExistError" };
type ResultParseError = { kind: "resultParseError" };
type ParamsParseError = { kind: "paramsParseError" };

// type ActionHandler<Params, Result> = (params: Params) => Result;

// type SignUpUser = ActionHandler<{ kind: "signUpUser" }, Either.Either<{}, {}>>;

type Endpoint = (body: string) => string;

// type SignUpUser = { kind: "signUpUser"; email: string; password: string };
// type ForgotPassword = { kind: "forgotPassword"; email: string };

// type Action = SignUpUser | ForgotPassword;
// type Action =
//   | ActionHandler<SignUpUser, E.Either<UserAlreadyExistsError, undefined>>
//   | ActionHandler<ForgotPassword, E.Either<UserDoesNotExistError, undefined>>;

// const invoke = <A extends Action>(test: A["in"]) =>
//   undefined as unknown as A["out"];

const SignUpUserParams = S.struct({
  kind: S.literal("signUpUser"),
  email: S.string,
  password: S.string,
});
type SignUpUserParams = S.Schema.To<typeof SignUpUserParams>;

const ForgotPasswordParams = S.struct({
  kind: S.literal("forgotPassword"),
  email: S.string,
});
type ForgotPasswordParams = S.Schema.To<typeof ForgotPasswordParams>;

const port = 4000;
const app = express();

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
