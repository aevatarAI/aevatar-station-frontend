import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./useTheme";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock document.documentElement
const mockDocumentElement = {
  setAttribute: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
};

Object.defineProperty(document, "documentElement", {
  value: mockDocumentElement,
});

// Mock document.body
Object.defineProperty(document, "body", {
  value: document.createElement("body"),
  writable: true,
});

describe("useTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document element mock
    mockDocumentElement.setAttribute.mockClear();
    mockDocumentElement.classList.add.mockClear();
    mockDocumentElement.classList.remove.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with dark theme when no saved theme", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("should initialize with saved theme from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
    expect(result.current.isLight).toBe(true);
  });

  it("should fallback to dark theme for invalid saved theme", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("should toggle theme correctly", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("should toggle from light to dark theme", () => {
    mockLocalStorage.getItem.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should set light theme correctly", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setLightTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("should set dark theme correctly", () => {
    mockLocalStorage.getItem.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isLight).toBe(false);
    expect(result.current.isDark).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should update document attributes when theme changes", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    const { result } = renderHook(() => useTheme());

    // Initial theme setup
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith("dark");

    // Toggle to light theme
    act(() => {
      result.current.toggleTheme();
    });

    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light",
    );
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith("dark");
  });

  it("should add dark class for dark theme", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    renderHook(() => useTheme());

    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith("dark");
  });

  it("should remove dark class for light theme", () => {
    mockLocalStorage.getItem.mockReturnValue("light");

    renderHook(() => useTheme());

    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith("dark");
  });

  it("should return correct theme state properties", () => {
    mockLocalStorage.getItem.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
    expect(typeof result.current.toggleTheme).toBe("function");
    expect(typeof result.current.setLightTheme).toBe("function");
    expect(typeof result.current.setDarkTheme).toBe("function");
  });
});
