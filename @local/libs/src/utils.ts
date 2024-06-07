import { Ef, flow, Schema } from "./toolbox";

export const helloWorld = "hello world";

export const Unit = Schema.TaggedStruct("Unit", {});
export type Unit = typeof Unit.Type;
export const unit: Unit = Unit.make({});

export const parseConfig = <Config>(configSchema: Schema.Schema<Config>) =>
  flow(
    Schema.decodeUnknown(configSchema),
    Ef.mapError(
      x => `Error parsing environment into config type:\n${x.message}`
    ),
    Ef.runSync
  );
