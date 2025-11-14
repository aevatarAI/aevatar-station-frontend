import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./useIsMobile";

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, "addEventListener", {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, "removeEventListener", {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInnerWidth(1024); // Default desktop width
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false for desktop width", () => {
    mockInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
  });

  it("should return true for mobile width", () => {
    mockInnerWidth(768);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
  });

  it("should return true for small mobile width", () => {
    mockInnerWidth(375);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
  });

  it("should return false for tablet width", () => {
    mockInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
  });

  it("should add resize event listener on mount", () => {
    renderHook(() => useIsMobile());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("should remove resize event listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("should update isMobile when window is resized", () => {
    mockInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);

    // Simulate resize to mobile width
    act(() => {
      mockInnerWidth(768);
      // Get the resize handler that was registered
      const resizeHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "resize",
      )?.[1];
      if (resizeHandler) {
        resizeHandler();
      }
    });

    expect(result.current.isMobile).toBe(true);
  });

  it("should handle boundary case at 768px", () => {
    mockInnerWidth(768);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
  });

  it("should handle boundary case at 769px", () => {
    mockInnerWidth(769);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
  });
});
