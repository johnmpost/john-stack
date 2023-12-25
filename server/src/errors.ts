import { S } from "./exports";

export const ResultParseError = S.struct({
  kind: S.literal("resultParseError"),
});
export type ResultParseError = S.Schema.To<typeof ResultParseError>;

export const UserAlreadyExistsError = S.struct({
  kind: S.literal("userAlreadyExistsError"),
});
export type UserAlreadyExistsError = S.Schema.To<typeof UserAlreadyExistsError>;

export const UserDoesNotExistError = S.struct({
  kind: S.literal("userDoesNotExistError"),
});
export type UserDoesNotExistError = S.Schema.To<typeof UserDoesNotExistError>;
