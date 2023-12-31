import {
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "./errors";
import { E, S } from "./exports";
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

const handleSignUpUser: ActionHandler<typeof signUpUser> = ({
  kind,
  email,
  password,
}) => E.right(unit);

export const actions: Action<any, any, any, any>[] = [
  { spec: signUpUser, handler: handleSignUpUser },
  handle(requestPasswordReset)(({ kind, email }) => E.right(unit)),
];
