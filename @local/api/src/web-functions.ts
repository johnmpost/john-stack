import { mkWebFunction } from "@local/common/src/johnapi";
import { GetTodos, getTodos } from "@local/common/src/web-functions";

export const webFunctions = [mkWebFunction(GetTodos, getTodos)];
