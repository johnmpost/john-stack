import { Schema } from "./toolbox";

export const Todo = Schema.Struct({
  id: Schema.String,
  title: Schema.NonEmpty,
  description: Schema.String,
});
export type Todo = typeof Todo.Type;
