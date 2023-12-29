import { S } from "./exports";

export const ParamsParseError = S.struct({
  kind: S.literal("paramsParseError"),
});
export type ParamsParseError = S.Schema.To<typeof ParamsParseError>;
export const paramsParseError: ParamsParseError = { kind: "paramsParseError" };

export const ResultParseError = S.struct({
  kind: S.literal("resultParseError"),
});
export type ResultParseError = S.Schema.To<typeof ResultParseError>;
export const resultParseError: ResultParseError = { kind: "resultParseError" };

export const UserAlreadyExistsError = S.struct({
  kind: S.literal("userAlreadyExistsError"),
});
export type UserAlreadyExistsError = S.Schema.To<typeof UserAlreadyExistsError>;
export const userAlreadyExistsError: UserAlreadyExistsError = {
  kind: "userAlreadyExistsError",
};

export const UserDoesNotExistError = S.struct({
  kind: S.literal("userDoesNotExistError"),
});
export type UserDoesNotExistError = S.Schema.To<typeof UserDoesNotExistError>;
export const userDoesNotExistError: UserDoesNotExistError = {
  kind: "userDoesNotExistError",
};

export const InvalidPasswordError = S.struct({
  kind: S.literal("invalidPasswordError"),
});
export type InvalidPasswordError = S.Schema.To<typeof InvalidPasswordError>;
export const invalidPasswordError: InvalidPasswordError = {
  kind: "invalidPasswordError",
};
