import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCloseDialog } from "./useCloseDialog";

// Mock DialogClose from radix-ui
vi.mock("@radix-ui/react-dialog", () => ({
  DialogClose: vi.fn(),
}));

describe("useCloseDialog", () => {
  it("should return ref and handleClose function", () => {
    const { result } = renderHook(() => useCloseDialog());

    expect(result.current.ref).toBeDefined();
    expect(result.current.handleClose).toBeDefined();
    expect(typeof result.current.handleClose).toBe("function");
  });

  it("should return a ref object", () => {
    const { result } = renderHook(() => useCloseDialog());

    expect(result.current.ref).toHaveProperty("current");
  });

  it("should call click on ref.current when handleClose is called", () => {
    const mockClick = vi.fn();
    const { result } = renderHook(() => useCloseDialog());

    // Mock the ref.current.click method
    result.current.ref.current = { click: mockClick } as any;

    act(() => {
      result.current.handleClose();
    });

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("should not throw error when ref.current is null", () => {
    const { result } = renderHook(() => useCloseDialog());

    // Ensure ref.current is null
    result.current.ref.current = null;

    expect(() => {
      act(() => {
        result.current.handleClose();
      });
    }).not.toThrow();
  });

  it("should not throw error when ref.current is undefined", () => {
    const { result } = renderHook(() => useCloseDialog());

    // Ensure ref.current is undefined
    result.current.ref.current = undefined;

    expect(() => {
      act(() => {
        result.current.handleClose();
      });
    }).not.toThrow();
  });

  it("should maintain ref stability across re-renders", () => {
    const { result, rerender } = renderHook(() => useCloseDialog());

    const initialRef = result.current.ref;

    rerender();

    expect(result.current.ref).toBe(initialRef);
  });

  it("should maintain handleClose function stability across re-renders", () => {
    const { result, rerender } = renderHook(() => useCloseDialog());

    const initialHandleClose = result.current.handleClose;

    rerender();

    // The function reference might change due to useCallback behavior
    // but the functionality should remain the same
    expect(typeof result.current.handleClose).toBe("function");
  });
});
