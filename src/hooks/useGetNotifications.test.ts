import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetNotifications, useSignalR } from "./useGetNotifications";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    notifications: {
      getNotifications: vi.fn(),
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
vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: vi.fn(() => ({
    withUrl: vi.fn().mockReturnThis(),
    configureLogging: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    build: vi.fn(() => ({
      start: vi.fn().mockResolvedValue(undefined),
    })),
  })),
  LogLevel: {
    Information: 1,
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

describe("useGetNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("should be defined", () => {
    const { result } = renderHook(() => useSignalR());
    expect(result.current).toBeDefined();
  });
});
