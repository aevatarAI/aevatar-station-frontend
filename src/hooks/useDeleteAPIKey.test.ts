import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteAPIKey } from "./useDeleteAPIKey";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiKeys: {
      deleteAPIKey: vi.fn(),
    },
  },
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    data: null,
    error: null,
  })),
  useQueryClient: vi.fn(() => ({
    refetchQueries: vi.fn(),
  })),
}));

describe("useDeleteAPIKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => useDeleteAPIKey());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useDeleteAPIKey());
    expect(result.current).toBeDefined();
  });
});
