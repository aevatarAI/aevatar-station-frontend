import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";

import "./styles/index.css";
import "./styles/com.css";
import "@aevatar-react-sdk/ui-react/ui-react.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

// Only inject StagewiseToolbar in development environment and desktop
if (import.meta.env.MODE === "development") {
  document.addEventListener("DOMContentLoaded", () => {
    // Check if device is mobile (width <= 768px)
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      const toolbarRoot = document.createElement("div");
      toolbarRoot.id = "stagewise-toolbar-root";
      document.body.appendChild(toolbarRoot);
      createRoot(toolbarRoot).render(
        <StrictMode>
          <StagewiseToolbar config={{ plugins: [] }} />
        </StrictMode>,
      );
    }
  });
}
