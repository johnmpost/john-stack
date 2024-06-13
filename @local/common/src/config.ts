import { Config } from "effect";

export const Client = Config.all({
  X_OPERATIONS_URL: Config.string("X_OPERATIONS_URL"),
});

export const Server = Config.all({
  DB_HOST: Config.string("DB_HOST"),
  DB_PORT: Config.integer("DB_PORT"),
  DB_NAME: Config.string("DB_NAME"),
  DB_USER: Config.string("DB_USER"),
  DB_PASSWORD: Config.redacted("DB_PASSWORD"),
});
