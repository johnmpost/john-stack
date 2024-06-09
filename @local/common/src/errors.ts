import { Schema } from "@effect/schema";

export const CannotConnectToHost = Schema.TaggedStruct(
  "CannotConnectToHost",
  {},
);
export type CannotConnectToHost = typeof CannotConnectToHost.Type;
