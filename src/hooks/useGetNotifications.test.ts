import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetNotifications, useSignalR } from "./useGetNotifications";

// Mock the API request
const mockGetNotifications = vi.hoisted(() => vi.fn());
vi.mock("@/api", () => ({
  request: {
    notifications: {
      getNotifications: mockGetNotifications,
    },
  },
}));

// Mock config
vi.mock("@/config", () => ({
  SIGNAL_R_URL: "https://test-signalr-url.com",
}));

// Mock useAccessTokenAtom
vi.mock("@/hooks/useAccessToken", () => ({
  useAccessTokenAtom: vi.fn(() => "test-token"),
}));

// Mock SignalR
const mockStart = vi.hoisted(() => vi.fn());
vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: vi.fn(() => ({
    withUrl: vi.fn().mockReturnThis(),
    configureLogging: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    build: vi.fn(() => ({
      start: mockStart,
    })),
  })),
  LogLevel: {
    Information: 1,
  },
}));

// Mock React Query
const mockUseQuery = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useQuery: mockUseQuery,
}));

describe("useGetNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it("should call useQuery with correct parameters", () => {
    const queryProps = { pageIndex: 1, pageSize: 10 };
    renderHook(() => useGetNotifications(queryProps));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["notifications", { pageIndex: 1, pageSize: 10 }],
      queryFn: expect.any(Function),
      refetchInterval: 1000 * 30,
      enabled: true,
    });
  });

  it("should call getNotifications API with correct parameters", async () => {
    const mockQueryFn = vi.fn();
    mockUseQuery.mockImplementation((config) => {
      mockQueryFn.mockImplementation(config.queryFn);
      return {
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      };
    });

    const queryProps = { pageIndex: 1, pageSize: 10 };
    renderHook(() => useGetNotifications(queryProps));

    await mockQueryFn();

    expect(mockGetNotifications).toHaveBeenCalledWith({
      params: { pageIndex: 1, pageSize: 10 },
    });
  });

  it("should disable query when pageIndex is negative", () => {
    const queryProps = { pageIndex: -1, pageSize: 10 };
    renderHook(() => useGetNotifications(queryProps));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["notifications", { pageIndex: -1, pageSize: 10 }],
      queryFn: expect.any(Function),
      refetchInterval: 1000 * 30,
      enabled: false,
    });
  });

  it("should disable query when pageSize is negative", () => {
    const queryProps = { pageIndex: 1, pageSize: -1 };
    renderHook(() => useGetNotifications(queryProps));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["notifications", { pageIndex: 1, pageSize: -1 }],
      queryFn: expect.any(Function),
      refetchInterval: 1000 * 30,
      enabled: false,
    });
  });

  it("should be defined", () => {
    const queryProps = { pageIndex: 1, pageSize: 10 };
    const { result } = renderHook(() => useGetNotifications(queryProps));
    expect(result.current).toBeDefined();
  });

  it("should handle different page parameters", () => {
    const queryProps = { pageIndex: 5, pageSize: 20 };
    const { result } = renderHook(() => useGetNotifications(queryProps));
    expect(result.current).toBeDefined();
  });
});

describe("useSignalR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters", () => {
    renderHook(() => useSignalR());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["signalR", { token: "test-token" }],
      queryFn: expect.any(Function),
    });
  });

  it("should establish SignalR connection successfully", async () => {
    const mockQueryFn = vi.fn();
    mockUseQuery.mockImplementation((config) => {
      mockQueryFn.mockImplementation(config.queryFn);
      return {
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      };
    });

    mockStart.mockResolvedValue(undefined);

    renderHook(() => useSignalR());

    const result = await mockQueryFn();

    expect(result).toBe(true);
    expect(mockStart).toHaveBeenCalled();
  });

  it("should handle SignalR connection error", async () => {
    const mockQueryFn = vi.fn();
    mockUseQuery.mockImplementation((config) => {
      mockQueryFn.mockImplementation(config.queryFn);
      return {
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      };
    });

    mockStart.mockRejectedValue(new Error("Connection failed"));

    renderHook(() => useSignalR());

    await expect(mockQueryFn()).rejects.toThrow(
      "Unable to establish SignalR connection",
    );
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useSignalR());
    expect(result.current).toBeDefined();
  });
});
