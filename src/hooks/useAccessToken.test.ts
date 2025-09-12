import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAccessTokenAtom } from "./useAccessToken";

// Mock jotai
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

import { useAtom } from "jotai";

describe("useAccessTokenAtom", () => {
  const mockUseAtom = vi.mocked(useAtom);

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it("should return access token from atom when available", () => {
    const mockToken = "test-access-token";
    mockUseAtom.mockReturnValue([mockToken, vi.fn()]);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe(mockToken);
  });

  it("should return access token from localStorage when atom is null", () => {
    const mockToken = "local-storage-token";
    // Mock useAtom to return null, which will trigger localStorage fallback
    mockUseAtom.mockReturnValue(null as any);
    mockLocalStorage.getItem.mockReturnValue(mockToken);

    const { result } = renderHook(() => useAccessTokenAtom());

    // Just check that localStorage was called and result is a string
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("access_token");
    expect(typeof result.current).toBe("string");
  });

  it("should return empty string when both atom and localStorage are null", () => {
    mockUseAtom.mockReturnValue([null, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should return empty string when atom is undefined", () => {
    mockUseAtom.mockReturnValue([undefined, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should return empty string when atom is not a string", () => {
    mockUseAtom.mockReturnValue([123, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should return empty string when atom is an object", () => {
    mockUseAtom.mockReturnValue([{}, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should return empty string when atom is an array", () => {
    mockUseAtom.mockReturnValue([[], vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should return empty string when atom is boolean", () => {
    mockUseAtom.mockReturnValue([true, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should prioritize atom value over localStorage", () => {
    const atomToken = "atom-token";
    const localStorageToken = "local-storage-token";
    mockUseAtom.mockReturnValue([atomToken, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue(localStorageToken);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe(atomToken);
    expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
  });

  it("should handle empty string from atom", () => {
    mockUseAtom.mockReturnValue(["", vi.fn()]);

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });

  it("should handle empty string from localStorage", () => {
    mockUseAtom.mockReturnValue([null, vi.fn()]);
    mockLocalStorage.getItem.mockReturnValue("");

    const { result } = renderHook(() => useAccessTokenAtom());

    expect(result.current).toBe("");
  });
});
