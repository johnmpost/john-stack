import { client, parseConfig } from "@local/common/src/config";

export const config = parseConfig(client)(import.meta.env);
