import express from "express";
import { A, E, O, S, flow, pipe } from "./exports";
import {
  ParamsParseError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { Action, ActionHandler, Unit, handle, invoke, unit } from "./utils";

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

const handleSignUpUser: ActionHandler<typeof signUpUser> = ({
  kind,
  email,
  password,
}) => E.right(unit);

const actions: Action<any, any>[] = [
  { spec: signUpUser, handler: handleSignUpUser },
  handle(requestPasswordReset)(({ kind, email }) => E.right(unit)),
];

const endpoint = (actions: Action<any, any>[]) => (requestBody: string) =>
  pipe(
    actions,
    // literally just find the first action that parses to a Some and return the action and the unwrapped Some
    // then apply the action handler to the parsed params
    // A.map(
    //   (action) =>
    //     [action, S.parseOption(action.spec.params)(requestBody)] as const
    // ),
    // A.findFirst(([_, maybeRequestBody]) => O.isSome(maybeRequestBody)),
    // O.map(([action, requestBody]) => O.getOrThrowWith(() => "impossible")),
    // A.findFirst((x) => S.is(x.spec.params)(requestBody)),
    // O.map((x) => x.handler),
    O.getOrElse(() => ParamsParseError)
  );

const port = 4000;
const app = express();

app.post("/action", (a, b, c) => {});

app.get("/test", (_, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
