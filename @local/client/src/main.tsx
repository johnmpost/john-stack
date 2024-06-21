import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Client as ClientConfig } from "@local/common/src/config";
import { ConfigProvider, Ef, Layer, pipe } from "@local/common/src/toolbox";

export const config = pipe(
  ClientConfig,
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env))),
  Ef.runSync,
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
