import { S } from "./toolbox";

export const Unit = S.struct({ _id: S.literal("unit") });
export type Unit = S.Schema.To<typeof Unit>;
export const unit: Unit = { _id: "unit" };

export const helloWorld = "hello world";
