import { Schema } from "@effect/schema";

export const CannotConnectToHost = Schema.TaggedStruct(
  "CannotConnectToHost",
  {},
);
export type CannotConnectToHost = typeof CannotConnectToHost.Type;

export const NotFound = Schema.TaggedStruct("NotFound", {});
export type NotFound = typeof NotFound.Type;
