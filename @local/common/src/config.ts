import { Ef, flow, S } from "./toolbox";

export const parseConfig = <From, To>(
  configSchema: S.Schema<never, From, To>
) =>
  flow(
    S.decodeUnknown(configSchema),
    Ef.mapError((x) => `Error parsing config/env:\n${x.message}`),
    Ef.runSync
  );

export const client = S.struct({ CLIENT_APOLLO_URL: S.string });

export const apollo = S.struct({
  APOLLO_PORT: S.NumberFromString,
  API_KEY: S.string,
});
