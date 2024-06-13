import { Schema } from "./toolbox";

export const helloWorld = "hello world";

export const Unit = Schema.TaggedStruct("Unit", {});
export type Unit = typeof Unit.Type;
export const unit: Unit = Unit.make({});
