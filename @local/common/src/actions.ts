import { S, E } from "../exports";
import {
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { ActionHandler } from "./john-api";
import { Unit, unit } from "./utils";

export const signUpUser = {
  params: S.struct({
    kind: S.literal("signUpUser"),
    email: S.string,
    password: S.string,
  }),
  result: S.either(S.union(InvalidPasswordError, UserAlreadyExistsError), Unit),
};

export const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.either(UserDoesNotExistError, Unit),
};

export const handleSignUpUser =
  (someDependency: any): ActionHandler<typeof signUpUser> =>
  ({ kind, email, password }) =>
    E.right(unit);
