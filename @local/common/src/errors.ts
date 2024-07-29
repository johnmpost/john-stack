import { Schema } from "@effect/schema";

export const UnreachableHost = Schema.TaggedStruct("CannotConnectToHost", {});
export type UnreachableHost = typeof UnreachableHost.Type;

export const NotFound = Schema.TaggedStruct("NotFound", {});
export type NotFound = typeof NotFound.Type;
