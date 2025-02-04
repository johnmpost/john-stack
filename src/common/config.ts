import { Config } from "effect";
import { prefix as prefix_ } from "./utils";

export const viteEnvPrefix = "X_";
const prefix = prefix_(viteEnvPrefix);

export const BrowserAppConfig = Config.all({
  apiServiceUrl: Config.string(prefix("API_SERVICE_URL")),
  zitadelUrl: Config.string(prefix("ZITADEL_URL")),
  zitadelClientId: Config.string(prefix("ZITADEL_CLIENT_ID_BROWSER_APP")),
});

export const ApiServiceConfig = Config.all({
  dbHost: Config.string("DB_HOST"),
  dbPort: Config.integer("DB_PORT"),
  dbName: Config.string("DB_NAME"),
  dbUser: Config.string("DB_USER"),
  dbPassword: Config.redacted("DB_PASSWORD"),
  zitadelUrl: Config.string(prefix("ZITADEL_URL")),
  zitadelClientId: Config.string("ZITADEL_CLIENT_ID_API_SERVICE"),
  zitadelClientSecret: Config.string("ZITADEL_CLIENT_SECRET_API_SERVICE"),
});
