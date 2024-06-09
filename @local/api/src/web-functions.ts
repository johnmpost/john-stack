import { mkWebFunction } from "@local/common/src/johnapi";
import {
  createTodo,
  CreateTodo,
  GetTodos,
  getTodos,
} from "@local/common/src/web-functions";

export const webFunctions = [
  mkWebFunction(GetTodos, getTodos),
  mkWebFunction(CreateTodo, createTodo),
];
