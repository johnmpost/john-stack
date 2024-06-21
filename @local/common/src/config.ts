import { Config } from "effect";
import { prefix as prefix_ } from "./utils";

export const viteEnvPrefix = "X_";
const prefix = prefix_(viteEnvPrefix);

export const Client = Config.all({
  restlessServerUrl: Config.string(prefix("RESTLESS_SERVER_URL")),
});

export const Server = Config.all({
  dbHost: Config.string("DB_HOST"),
  dbPort: Config.integer("DB_PORT"),
  dbName: Config.string("DB_NAME"),
  dbUser: Config.string("DB_USER"),
  dbPassword: Config.redacted("DB_PASSWORD"),
});
