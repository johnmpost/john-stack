import { Server } from "@local/common/src/config";
import { mkWebFunction } from "@local/common/src/johnapi";
import { parseConfig } from "@local/common/src/utils";
import { GetTodos, getTodos } from "@local/common/src/web-functions";

const config = parseConfig(Server)(process.env);
export const webFunctions = [mkWebFunction(GetTodos, getTodos)];
