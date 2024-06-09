import { Invoker } from "@local/common/src/johnapi";
import { createContext, useContext } from "react";

const InvokeContext = createContext<Invoker>(null as unknown as Invoker);
export const InvokeProvider = InvokeContext.Provider;

export const useInvoke = () => useContext(InvokeContext);
