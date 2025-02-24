import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { requirements, RequirementsContext } from "./requirements.ts";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RequirementsContext.Provider value={requirements}>
        <App />
      </RequirementsContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
