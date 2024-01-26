import { S } from "../exports";
import {
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { Unit } from "./utils";

export const signUpUser = {
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

export const requestPasswordReset = {
  params: S.struct({
    kind: S.literal("forgotPassword"),
    email: S.string,
  }),
  result: S.eitherFromSelf(UserDoesNotExistError, Unit),
};
