import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/index.css";
import "./styles/com.css";
import "@aevatar-react-sdk/ui-react/ui-react.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Only inject StagewiseToolbar in development environment
if (import.meta.env.MODE === "development") {
  document.addEventListener("DOMContentLoaded", () => {
    const toolbarRoot = document.createElement("div");
    toolbarRoot.id = "stagewise-toolbar-root";
    document.body.appendChild(toolbarRoot);
    createRoot(toolbarRoot).render(
      <StrictMode>
        <StagewiseToolbar config={{ plugins: [] }} />
      </StrictMode>,
    );
  });
}
