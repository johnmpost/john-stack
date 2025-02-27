import { pipe } from "./toolbox";
import { Config, String } from "effect";
import { ApiServiceConfig } from "./config";
import { PgClient } from "@effect/sql-pg";

export const mkDb = () =>
  PgClient.layerConfig(
    pipe(
      ApiServiceConfig,
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
