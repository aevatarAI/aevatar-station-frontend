import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetLLMTokens } from "./useGetLLMTokenUsage";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiRequests: {
      getLLMTokenUsage: vi.fn(),
    },
  },
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

describe("useGetLLMTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters when enabled", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;

    renderHook(() => useGetLLMTokens(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["llm-tokens-usage"],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when date is invalid", () => {
    const date = { from: 0, to: 0 };
    const hasPermission = true;

    renderHook(() => useGetLLMTokens(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["llm-tokens-usage"],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should be disabled when hasPermission is false", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = false;

    renderHook(() => useGetLLMTokens(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["llm-tokens-usage"],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should call getLLMTokenUsage API with correct parameters", async () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;
    const mockResponse = { data: [] };
    (request.apiRequests.getLLMTokenUsage as any).mockResolvedValue(
      mockResponse,
    );

    renderHook(() => useGetLLMTokens(date, hasPermission));

    // Get the queryFn from the mock call
    const queryCall = vi.mocked(useQuery).mock.calls[0][0];
    await queryCall.queryFn();

    expect(request.apiRequests.getLLMTokenUsage).toHaveBeenCalledWith({});
  });

  it("should be defined", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;
    const { result } = renderHook(() => useGetLLMTokens(date, hasPermission));
    expect(result.current).toBeDefined();
  });
});
