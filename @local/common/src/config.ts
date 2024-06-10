import { Schema } from "./toolbox";

export const Client = Schema.Struct({
  CLIENT_OPERATIONS_URL: Schema.String,
});

export const Server = Schema.Struct({
  API_KEY: Schema.String,
});
