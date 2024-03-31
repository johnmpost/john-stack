import { S } from "./toolbox";

export const NoMatchingActionError = S.struct({
  kind: S.literal("noMatchingActionError"),
});
export type NoMatchingActionError = S.Schema.To<typeof NoMatchingActionError>;
export const noMatchingActionError: NoMatchingActionError = {
  kind: "noMatchingActionError",
};

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

export const networkError = { kind: "networkError" as const };
export type NetworkError = typeof networkError;

export const parseError = { kind: "parseError" as const };
export type ParseError = typeof parseError;
