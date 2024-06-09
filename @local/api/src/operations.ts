import { mkOperation, Operation } from "@local/common/src/johnapi";
import {
  getTodo,
  GetTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/operations";

export const operations = [
  mkOperation(GetTodos, getTodos),
  mkOperation(GetTodo, getTodo),
] as Operation<any, any, any, any, any, any>[];
