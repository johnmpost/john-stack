import { S, E } from "../exports";
import {
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { ActionHandler, Action, handle } from "./john-api";
import { Unit, unit } from "./utils";

const signUpUser = {
  params: S.struct({
    kind: S.literal("signUpUser"),
    email: S.string,
    password: S.string,
  }),
  result: S.either(S.union(InvalidPasswordError, UserAlreadyExistsError), Unit),
};

const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.either(UserDoesNotExistError, Unit),
};

const handleSignUpUser =
  (someDependency: any): ActionHandler<typeof signUpUser> =>
  ({ kind, email, password }) =>
    E.right(unit);

export const actions: Action<any, any, any, any>[] = [
  handle(signUpUser)(handleSignUpUser("dependency here")),
  handle(requestPasswordReset)(({ kind, email }) => E.right(unit)),
];
