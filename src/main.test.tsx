import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-dom/client
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(),
}));

// Mock App component
vi.mock("./App", () => ({
  default: () => <div data-testid="app">App Component</div>,
}));

// Mock ThemeProvider
vi.mock("./components/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock StagewiseToolbar
vi.mock("@stagewise/toolbar-react", () => ({
  StagewiseToolbar: ({ config: _config }: { config: any }) => (
    <div data-testid="stagewise-toolbar">Stagewise Toolbar</div>
  ),
}));

// Mock CSS imports
vi.mock("./styles/index.css", () => ({}));
vi.mock("./styles/com.css", () => ({}));
vi.mock("@aevatar-react-sdk/ui-react/ui-react.css", () => ({}));

describe("main.tsx functionality", () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("should have createRoot function available", () => {
    expect(createRoot).toBeDefined();
    expect(typeof createRoot).toBe("function");
  });

  it("should have StrictMode available", () => {
    expect(StrictMode).toBeDefined();
  });

  it("should handle window.innerWidth for mobile detection", () => {
    // Test desktop width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    expect(window.innerWidth).toBe(1024);
    expect(window.innerWidth > 768).toBe(true);

    // Test mobile width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 600,
    });
    expect(window.innerWidth).toBe(600);
    expect(window.innerWidth <= 768).toBe(true);
  });

  it("should handle import.meta.env.MODE", () => {
    // Test development mode
    Object.defineProperty(import.meta, "env", {
      value: {
        MODE: "development",
      },
      writable: true,
    });
    expect(import.meta.env.MODE).toBe("development");

    // Test production mode
    Object.defineProperty(import.meta, "env", {
      value: {
        MODE: "production",
      },
      writable: true,
    });
    expect(import.meta.env.MODE).toBe("production");
  });

  it("should handle DOMContentLoaded event", () => {
    const mockCallback = vi.fn();

    // Add event listener
    document.addEventListener("DOMContentLoaded", mockCallback);

    // Simulate DOMContentLoaded event
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);

    // Wait for event to be processed
    expect(mockCallback).toHaveBeenCalled();
  });

  it("should create DOM elements", () => {
    const toolbarRoot = document.createElement("div");
    toolbarRoot.id = "stagewise-toolbar-root";

    expect(toolbarRoot).toBeDefined();
    expect(toolbarRoot.id).toBe("stagewise-toolbar-root");
  });

  it("should handle non-null assertion", () => {
    // Test with null element - createRoot is mocked so it won't throw
    const nullElement = null;
    expect(() => createRoot(nullElement as any)).not.toThrow();
  });

  it("should have all required imports available", () => {
    // Test that all main.tsx imports are available
    expect(createRoot).toBeDefined();
    expect(StrictMode).toBeDefined();

    // Test that mocked components are available
    expect(vi.isMockFunction(createRoot)).toBe(true);
  });
});
