import { S } from "./toolbox";

export const client = S.struct({ CLIENT_API_HOSTNAME: S.string });

export const apollo = S.struct({ PORT: S.NumberFromString });
