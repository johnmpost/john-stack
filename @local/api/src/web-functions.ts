import { mkWebFunction } from "@local/common/src/johnapi";
import { GetTodos, getTodos } from "@local/common/src/operations";

export const webFunctions = [mkWebFunction(GetTodos, getTodos)];
