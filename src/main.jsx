import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DataProvider } from "./data/DataContext.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DataProvider>
        <App />
      </DataProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
