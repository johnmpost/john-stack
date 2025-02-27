import { Schema } from "effect";

export const UnreachableHost = Schema.TaggedStruct("CannotConnectToHost", {});
export type UnreachableHost = typeof UnreachableHost.Type;

export const NotFound = Schema.TaggedStruct("NotFound", {});
export type NotFound = typeof NotFound.Type;

export const NotAuthorized = Schema.TaggedStruct("NotAuthorized", {});
export type NotAuthorized = typeof NotAuthorized.Type;
