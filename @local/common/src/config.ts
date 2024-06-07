import { Schema } from "@local/libs/src/toolbox";

export const Client = Schema.Struct({ CLIENT_SERVER_URL: Schema.String });

const PortFromString = Schema.lessThanOrEqualTo(65535)(
  Schema.compose(Schema.NumberFromString, Schema.Int)
);

export const Server = Schema.Struct({
  SERVE_ON_PORT: PortFromString,
  API_KEY: Schema.String,
});
