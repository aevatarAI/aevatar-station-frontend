import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateAPIKey } from "./useCreateAPIKey";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiKeys: {
      createAPIKey: vi.fn(),
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

import { request } from "@/api";
import { useMutation } from "@tanstack/react-query";

describe("useCreateAPIKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => useCreateAPIKey());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useCreateAPIKey());

    expect(useMutation).toHaveBeenCalledWith({
      mutationKey: ["createAPIKey"],
      mutationFn: expect.any(Function),
      onSettled: expect.any(Function),
    });
  });

  it("should call createAPIKey with correct parameters", async () => {
    const mockPayload = { projectId: "project-123", name: "Test API Key" };
    const mockResponse = { success: true };
    (request.apiKeys.createAPIKey as any).mockResolvedValue(mockResponse);

    renderHook(() => useCreateAPIKey());

    // Get the mutationFn from the mock call
    const mutationCall = vi.mocked(useMutation).mock.calls[0][0];
    await mutationCall.mutationFn(mockPayload);

    expect(request.apiKeys.createAPIKey).toHaveBeenCalledWith({
      data: mockPayload,
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useCreateAPIKey());
    expect(result.current).toBeDefined();
  });
});
