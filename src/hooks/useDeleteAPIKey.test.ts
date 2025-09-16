import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteAPIKey } from "./useDeleteAPIKey";

// Mock the API request
const mockDeleteAPIKey = vi.hoisted(() => vi.fn());
vi.mock("@/api", () => ({
  request: {
    apiKeys: {
      deleteAPIKey: mockDeleteAPIKey,
    },
  },
}));

// Mock React Query
const mockRefetchQueries = vi.hoisted(() => vi.fn());
const mockUseMutation = vi.hoisted(() => vi.fn());
const mockUseQueryClient = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

describe("useDeleteAPIKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
      data: null,
      error: null,
    });
    mockUseQueryClient.mockReturnValue({
      refetchQueries: mockRefetchQueries,
    });
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

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useDeleteAPIKey());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationKey: ["deleteAPIKey"],
      mutationFn: expect.any(Function),
      onSettled: expect.any(Function),
    });
  });

  it("should call deleteAPIKey API with correct query parameter", async () => {
    const mockMutationFn = vi.fn();
    mockUseMutation.mockImplementation((config) => {
      mockMutationFn.mockImplementation(config.mutationFn);
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
      };
    });

    renderHook(() => useDeleteAPIKey());

    const testData = {
      projectId: "project-123",
      id: "key-123",
    };

    await mockMutationFn(testData);

    expect(mockDeleteAPIKey).toHaveBeenCalledWith({
      query: "key-123",
    });
  });

  it("should refetch queries on settled", async () => {
    const mockOnSettled = vi.fn();
    mockUseMutation.mockImplementation((config) => {
      mockOnSettled.mockImplementation(config.onSettled);
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
      };
    });

    renderHook(() => useDeleteAPIKey());

    const testData = {
      projectId: "project-123",
      id: "key-123",
    };

    mockOnSettled(undefined, undefined, testData);

    expect(mockRefetchQueries).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId: "project-123" }],
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useDeleteAPIKey());
    expect(result.current).toBeDefined();
  });
});
