import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetAPIKeys } from "./useGetAPIKey";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiKeys: {
      getAPIKeys: vi.fn(),
    },
  },
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

const mockRequest = vi.mocked(request);
const mockUseQuery = vi.mocked(useQuery);

describe("useGetAPIKeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters when projectId is provided", () => {
    const projectId = "test-project-id";
    const mockData = { keys: ["key1", "key2"] };
    mockRequest.apiKeys.getAPIKeys.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should call getAPIKeys API with correct projectId when queryFn is executed", async () => {
    const projectId = "test-project-id";
    const mockData = { keys: ["key1", "key2"] };
    mockRequest.apiKeys.getAPIKeys.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    // Get the queryFn from the mock call
    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    await queryFn();

    expect(mockRequest.apiKeys.getAPIKeys).toHaveBeenCalledWith({
      query: projectId,
    });
  });

  it("should be enabled when projectId is provided", () => {
    const projectId = "test-project-id";
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when projectId is empty string", () => {
    const projectId = "";
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId }],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should be disabled when projectId is null", () => {
    const projectId = null as any;
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId }],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should be disabled when projectId is undefined", () => {
    const projectId = undefined as any;
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetAPIKeys(projectId);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["apikeys", { projectId }],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should handle API success", async () => {
    const projectId = "test-project-id";
    const mockData = { keys: ["key1", "key2"] };
    mockRequest.apiKeys.getAPIKeys.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const result = useGetAPIKeys(projectId);

    expect(result.data).toEqual(mockData);
    expect(result.isError).toBe(false);
  });

  it("should handle API error", async () => {
    const projectId = "test-project-id";
    const mockError = new Error("API Error");
    mockRequest.apiKeys.getAPIKeys.mockRejectedValue(mockError);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    const result = useGetAPIKeys(projectId);

    expect(result.isError).toBe(true);
    expect(result.error).toEqual(mockError);
  });
});
