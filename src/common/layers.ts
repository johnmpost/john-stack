import { pipe } from "./toolbox";
import * as Pg from "@effect/sql-pg";
import { Config, String } from "effect";
import { Server } from "./config";

export const mkDb = () =>
  Pg.client.layer(
    pipe(
      Server,
      Config.map(({ dbHost, dbPort, dbName, dbUser, dbPassword }) => ({
        host: dbHost,
        port: dbPort,
        database: dbName,
        username: dbUser,
        password: dbPassword,
        transformQueryNames: String.camelToSnake,
        transformResultNames: String.snakeToCamel,
      })),
    ),
  );
