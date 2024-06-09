import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mkInvoke } from "@local/common/src/johnapi.ts";
import { config } from "./config.ts";
import { InvokeProvider } from "./InvokeContext.ts";

const queryClient = new QueryClient();
const invoke = mkInvoke(config.CLIENT_WEB_FUNCTIONS_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InvokeProvider value={invoke}>
        <App />
      </InvokeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
