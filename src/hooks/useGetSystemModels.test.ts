import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetSystemModels } from "./useGetSystemModels";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiRequests: {
      getSystemLLM: vi.fn(),
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

describe("useGetSystemModels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters", () => {
    const mockData = { models: ["gpt-3.5-turbo", "gpt-4"] };
    mockRequest.apiRequests.getSystemLLM.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetSystemModels();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["models"],
      queryFn: expect.any(Function),
    });
  });

  it("should call getSystemLLM API when queryFn is executed", async () => {
    const mockData = { models: ["gpt-3.5-turbo", "gpt-4"] };
    mockRequest.apiRequests.getSystemLLM.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetSystemModels();

    // Get the queryFn from the mock call
    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    await queryFn();

    expect(mockRequest.apiRequests.getSystemLLM).toHaveBeenCalledTimes(1);
  });

  it("should return the result from useQuery", () => {
    const mockData = { models: ["gpt-3.5-turbo", "gpt-4"] };
    const mockQueryResult = {
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    };
    mockUseQuery.mockReturnValue(mockQueryResult as any);

    const result = useGetSystemModels();

    expect(result).toBe(mockQueryResult);
  });

  it("should handle API success", async () => {
    const mockData = { models: ["gpt-3.5-turbo", "gpt-4"] };
    mockRequest.apiRequests.getSystemLLM.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const result = useGetSystemModels();

    expect(result.data).toEqual(mockData);
    expect(result.isError).toBe(false);
  });

  it("should handle API error", async () => {
    const mockError = new Error("API Error");
    mockRequest.apiRequests.getSystemLLM.mockRejectedValue(mockError);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    const result = useGetSystemModels();

    expect(result.isError).toBe(true);
    expect(result.error).toEqual(mockError);
  });
});
