import { pipe, Schema } from "./toolbox";

export const Todo = Schema.Struct({
  id: Schema.String,
  title: pipe(Schema.String, Schema.maxLength(255)),
  description: Schema.String,
  orgId: Schema.String,
});
export type Todo = typeof Todo.Type;

export const IntrospectResult = Schema.Struct({
  "urn:zitadel:iam:user:resourceowner:id": Schema.String,
});
export type IntrospectResult = typeof IntrospectResult.Type;
