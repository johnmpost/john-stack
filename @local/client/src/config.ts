import { Client } from "@local/common/src/config";
import { parseConfig } from "@local/common/src/utils";

export const config = parseConfig(Client)(import.meta.env);
